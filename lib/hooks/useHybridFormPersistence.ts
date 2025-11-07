import { useCallback, useEffect, useRef, useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { HybridFormPersistence, FormPersistenceConfig } from '../hybrid-form-persistence';

interface UseHybridFormPersistenceOptions<T extends FieldValues> {
  formType: 'flight' | 'cruise';
  watch: UseFormReturn<T>['watch'];
  reset: UseFormReturn<T>['reset'];
  mode: string;
  autoSaveDelay?: number;
  maxLocalStorageSize?: number;
}

interface UseHybridFormPersistenceReturn {
  isLoading: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveError: string | null;
  saveFormData: () => Promise<void>;
  clearSavedData: (mode?: string) => void;
  sessionToken: string;
}

/**
 * Enhanced form persistence hook with intelligent storage strategy
 */
export function useHybridFormPersistence<T extends FieldValues>({
  formType,
  watch,
  reset,
  mode,
  autoSaveDelay = 2000,
  maxLocalStorageSize = 2 * 1024 * 1024 // 2MB
}: UseHybridFormPersistenceOptions<T>): UseHybridFormPersistenceReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const persistenceManagerRef = useRef<HybridFormPersistence | null>(null);
  const watchedValues = watch();
  const hasLoadedRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<T | null>(null);
  const previousModeRef = useRef<string>(mode);
  const watchedValuesRef = useRef<T>(watchedValues);

  // Keep watchedValuesRef up to date
  useEffect(() => {
    watchedValuesRef.current = watchedValues;
  }, [watchedValues]);

  /**
   * Save form data to storage
   */
  const saveFormData = useCallback(async () => {
    if (!persistenceManagerRef.current || isLoading) return;

    // Use the ref to get the latest values
    const currentValues = watchedValuesRef.current;
    
    setSaveStatus('saving');
    setSaveError(null);

    try {
      // Clean the data before saving - remove File objects and other non-serializable types
      const cleanData = (data: T): Record<string, unknown> => {
        const cleaned: Record<string, unknown> = {};
        Object.keys(data).forEach(key => {
          const value = data[key];
          
          // Skip File objects - they can't be serialized and are handled on submit
          if (value instanceof File || value instanceof FileList) {
            return; // Don't save files to localStorage
          }
          
          // Skip functions
          if (typeof value === 'function') {
            return;
          }
          
          // Skip undefined
          if (value === undefined) {
            return;
          }
          
          // Handle arrays - recursively clean them
          if (Array.isArray(value)) {
            cleaned[key] = value.map(item => {
              if (item instanceof File || typeof item === 'function') {
                return null; // Replace files/functions with null
              }
              if (typeof item === 'object' && item !== null) {
                return cleanData(item as T);
              }
              return item;
            });
          } else if (typeof value === 'object' && value !== null) {
            // Recursively clean nested objects
            cleaned[key] = cleanData(value as T);
          } else {
            cleaned[key] = value;
          }
        });
        return cleaned;
      };

      const cleanedValues = cleanData(currentValues) as T;
      
      // Verify the data can be serialized before attempting to save
      try {
        JSON.stringify(cleanedValues);
      } catch (serializeError) {
        console.error(`❌ [${formType}] Data cannot be serialized:`, serializeError);
        setSaveStatus('error');
        setSaveError('Form data contains non-serializable values');
        return;
      }

      const result = await persistenceManagerRef.current.saveFormData(cleanedValues, mode);
      
      if (result.success) {
        setSaveStatus('saved');
        const dataKeys = Object.keys(cleanedValues).length;
        console.log(`✅ [${formType}] Form data saved using ${result.method} (mode: ${mode}, ${dataKeys} keys)`);
        
        // Verify the data was actually saved by checking localStorage
        if (typeof window !== 'undefined') {
          const storageKey = `${formType}_form_draft_${mode}`;
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            console.log(`✅ [${formType}] Verified: Data exists in localStorage (${(saved.length / 1024).toFixed(1)}KB)`);
          } else {
            console.warn(`⚠️ [${formType}] Warning: Data not found in localStorage after save!`);
          }
        }
        
        // Update the last saved data reference for comparison
        lastSavedDataRef.current = cleanedValues;
        
        // Clear save status after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setSaveError(result.error || 'Failed to save form data');
        console.error(`❌ [${formType}] Failed to save form data:`, result.error);
      }
    } catch (error) {
      setSaveStatus('error');
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
      console.error(`❌ [${formType}] Error saving form data:`, error);
    }
  }, [mode, isLoading, formType]);

  // Initialize persistence manager
  useEffect(() => {
    const config: FormPersistenceConfig = {
      formType,
      autoSaveDelay,
      maxLocalStorageSize
    };
    
    persistenceManagerRef.current = new HybridFormPersistence(config);
    console.log(`🔄 [${formType}] Initializing persistence manager (mode: ${mode})`);
    
    // Reset hasLoaded when formType or mode changes
    if (previousModeRef.current !== mode) {
      console.log(`🔄 [${formType}] Mode changed from ${previousModeRef.current} to ${mode}, resetting load state`);
      hasLoadedRef.current = false;
      lastSavedDataRef.current = null; // Clear saved data ref when mode changes
      previousModeRef.current = mode;
    }
    
    // Load form data after initialization if not already loaded
    if (!hasLoadedRef.current) {
      // Use a small delay to ensure persistence manager is fully initialized
      const loadData = async () => {
        setIsLoading(true);
        try {
          // Debug: Check localStorage before loading
          if (typeof window !== 'undefined') {
            const storageKey = `${formType}_form_draft_${mode}`;
            const modeKey = `${formType}_form_draft_${mode}_mode`;
            const saved = localStorage.getItem(storageKey);
            const savedMode = localStorage.getItem(modeKey);
            console.log(`🔍 [${formType}] Checking storage before load:`, {
              hasData: !!saved,
              savedMode,
              currentMode: mode,
              storageKey,
              dataSize: saved ? `${(saved.length / 1024).toFixed(1)}KB` : 'N/A'
            });
          }
          
          const result = await persistenceManagerRef.current!.loadFormData(mode);
          
          if (result.success && result.data && Object.keys(result.data).length > 0) {
            // Populate form with saved data
            reset(result.data as T);
            // Set the last saved data reference to prevent unnecessary save
            lastSavedDataRef.current = result.data as T;
            console.log(`✅ [${formType}] Form data loaded successfully using ${result.method} (mode: ${mode}, ${Object.keys(result.data).length} keys)`);
          } else {
            console.log(`ℹ️ [${formType}] No saved form data found (mode: ${mode})`, result.error || '');
          }
        } catch (error) {
          console.error(`❌ [${formType}] Error loading form data:`, error);
        } finally {
          setIsLoading(false);
          hasLoadedRef.current = true;
        }
      };
      
      loadData();
    } else {
      // If already loaded, ensure loading is false to allow auto-saving
      setIsLoading(false);
    }
    // Note: reset is stable from react-hook-form, so it's safe to include in dependencies
  }, [formType, autoSaveDelay, maxLocalStorageSize, mode, reset]);

  /**
   * Clear all saved form data - optionally for a specific mode
   * @param modeToClear - If provided, only clears data for this mode. If not provided, clears current mode or all modes.
   */
  const clearSavedData = useCallback((modeToClear?: string) => {
    if (persistenceManagerRef.current) {
      // Use provided mode, or fall back to current mode, or clear all if no mode specified
      const targetMode = modeToClear || mode || undefined;
      persistenceManagerRef.current.clearSavedData(targetMode);
      setSaveStatus('idle');
      setSaveError(null);
      // Also reset the form if clearing current mode
      if (!targetMode || targetMode === mode) {
        reset({} as T);
      }
    }
  }, [mode, reset]);


  // Auto-save form data when values change
  useEffect(() => {
    // Skip if still loading, no manager, or no form data
    if (isLoading || !persistenceManagerRef.current) {
      return;
    }
    
    const formDataKeys = Object.keys(watchedValues).filter(key => {
      const value = watchedValues[key];
      // Ignore undefined, but include null, empty strings, and other values
      return value !== undefined;
    });
    
    if (formDataKeys.length === 0) {
      return;
    }
    
    // Check if data actually changed from last save
    // Simple comparison - only skip File objects which can't be serialized
    const getSerializableData = (data: T): string => {
      try {
        const serializable: Record<string, unknown> = {};
        Object.keys(data).forEach(key => {
          const value = data[key];
          // Skip File objects - they can't be serialized to JSON
          if (value instanceof File || value instanceof FileList) {
            return; // Don't include in comparison
          }
          serializable[key] = value;
        });
        return JSON.stringify(serializable);
      } catch (error) {
        // If serialization fails, assume data changed
        console.warn('Failed to serialize data for comparison:', error);
        return Date.now().toString(); // Force change detection
      }
    };
    
    const currentDataStr = getSerializableData(watchedValues);
    const lastSavedDataStr = lastSavedDataRef.current ? getSerializableData(lastSavedDataRef.current) : '';
    const hasDataChanged = currentDataStr !== lastSavedDataStr;
    
    if (hasDataChanged) {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set new timeout
      saveTimeoutRef.current = setTimeout(() => {
        console.log(`💾 [${formType}] Auto-saving form data (mode: ${mode}, keys: ${formDataKeys.length})...`);
        saveFormData();
        // Note: lastSavedDataRef is updated inside saveFormData after successful save
      }, autoSaveDelay);
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [watchedValues, saveFormData, isLoading, autoSaveDelay, formType, mode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    saveStatus,
    saveError,
    saveFormData,
    clearSavedData,
    sessionToken: persistenceManagerRef.current?.sessionToken || ''
  };
}
