import { useEffect, useRef, useCallback, useState } from 'react';
import { UseFormWatch, UseFormReset, FieldValues } from 'react-hook-form';
import { createFormPersistenceManager, FormPersistenceManager } from '../form-persistence';
import { debounce } from 'lodash';

interface UseFormPersistenceOptions<T extends FieldValues> {
  formType: 'flight' | 'cruise';
  watch: UseFormWatch<T>;
  reset: UseFormReset<T>;
  autoSaveDelay?: number; // milliseconds
}

interface UseFormPersistenceReturn {
  isLoading: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveError: string | null;
  manualSave: () => Promise<void>;
  clearForm: () => Promise<void>;
  sessionToken: string;
}

/**
 * Custom hook to handle form persistence with automatic saving and loading
 */
export function useFormPersistence<T extends FieldValues>({
  formType,
  watch,
  reset,
  autoSaveDelay = 2000 // 2 seconds default
}: UseFormPersistenceOptions<T>): UseFormPersistenceReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const persistenceManagerRef = useRef<FormPersistenceManager | null>(null);
  const watchedValues = watch();
  const hasLoadedRef = useRef(false);

  // Initialize persistence manager
  useEffect(() => {
    persistenceManagerRef.current = createFormPersistenceManager(formType);
    loadFormData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formType]);

  /**
   * Load form data from storage and populate form
   */
  const loadFormData = useCallback(async () => {
    if (!persistenceManagerRef.current || hasLoadedRef.current) return;

    setIsLoading(true);
    try {
      const result = await persistenceManagerRef.current.loadFormData();
      
      if (result.success && result.data && Object.keys(result.data).length > 0) {
        // Populate form with saved data
        reset(result.data as T);
        console.log('Form data loaded successfully');
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    } finally {
      setIsLoading(false);
      hasLoadedRef.current = true;
    }
  }, [reset]);

  /**
   * Save form data to storage
   */
  const saveFormData = useCallback(async (formData: Record<string, unknown>) => {
    if (!persistenceManagerRef.current) return;

    setSaveStatus('saving');
    setSaveError(null);

    try {
      const result = await persistenceManagerRef.current.saveFormData({
        formData,
        currentStep: 'form-entry'
      });

      if (result.success) {
        setSaveStatus('saved');
        // Reset to idle after showing saved status for a moment
        setTimeout(() => setSaveStatus('idle'), 1500);
      } else {
        setSaveStatus('error');
        setSaveError(result.error || 'Failed to save form data');
      }
    } catch (error) {
      setSaveStatus('error');
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, []);

  // Create debounced save function to avoid too frequent saves
  const debouncedSave = useRef(
    debounce((formData: Record<string, unknown>) => {
      saveFormData(formData);
    }, autoSaveDelay)
  ).current;

  // Auto-save when form values change
  useEffect(() => {
    // Don't auto-save until initial load is complete
    if (!hasLoadedRef.current || isLoading) return;
    
    // Filter out empty values to avoid saving incomplete forms
    const filteredData = Object.entries(watchedValues)
      .filter(([, value]) => {
        // Keep non-empty strings, non-zero numbers, booleans, and objects
        if (typeof value === 'string') return value.trim() !== '';
        if (typeof value === 'number') return true;
        if (typeof value === 'boolean') return true;
        if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
        return false;
      })
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, unknown>);

    // Only save if there's meaningful data
    if (Object.keys(filteredData).length > 0) {
      debouncedSave(filteredData);
    }
  }, [watchedValues, debouncedSave, isLoading]);

  /**
   * Manual save function for immediate saving
   */
  const manualSave = useCallback(async () => {
    const filteredData = Object.entries(watchedValues)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, unknown>);

    await saveFormData(filteredData);
  }, [watchedValues, saveFormData]);

  /**
   * Clear form data from storage and reset form
   */
  const clearForm = useCallback(async () => {
    if (!persistenceManagerRef.current) return;

    try {
      await persistenceManagerRef.current.clearSession();
      
      // Reset form to empty values
      reset();

      setSaveStatus('idle');
      setSaveError(null);
      console.log('Form cleared successfully');
    } catch (error) {
      console.error('Error clearing form:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to clear form');
    }
  }, [reset]);

  /**
   * Get session token for debugging
   */
  const sessionToken = persistenceManagerRef.current?.getSessionToken() || '';

  return {
    isLoading,
    saveStatus,
    saveError,
    manualSave,
    clearForm,
    sessionToken
  };
}

/**
 * Hook to check if user has an existing session
 */
export function useHasExistingSession(formType: 'flight' | 'cruise') {
  const [hasSession, setHasSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const manager = createFormPersistenceManager(formType);
      const result = await manager.hasExistingSession();
      setHasSession(result);
      setIsChecking(false);
    };

    checkSession();
  }, [formType]);

  return { hasSession, isChecking };
}

/**
 * Hook to mark form as completed
 */
export function useMarkFormCompleted(formType: 'flight' | 'cruise') {
  const markCompleted = useCallback(async () => {
    const manager = createFormPersistenceManager(formType);
    const result = await manager.markAsCompleted();
    
    if (result.success) {
      console.log('Form marked as completed');
    } else {
      console.error('Failed to mark form as completed:', result.error);
    }
    
    return result;
  }, [formType]);

  return { markCompleted };
}
