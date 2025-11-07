import { useEffect, useRef, useCallback, useState } from 'react';
import { UseFormWatch, UseFormReset, FieldValues } from 'react-hook-form';
import { ApplicationSessionManager } from '../application-session';
import { debounce } from 'lodash';
import { useSearchParams } from 'next/navigation';

interface UseApplicationSessionOptions<T extends FieldValues> {
  formType: 'flight' | 'cruise';
  watch: UseFormWatch<T>;
  reset: UseFormReset<T>;
  autoSaveDelay?: number; // milliseconds
}

interface UseApplicationSessionReturn {
  isLoading: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveError: string | null;
  applicationDetails?: {
    customerEmail?: string;
    customerName?: string;
    travelMethod?: string;
    travelType?: string;
  };
  manualSave: () => Promise<void>;
  clearForm: () => Promise<void>;
  sessionToken: string;
  stripeSessionId?: string;
}

/**
 * Enhanced hook for payment-linked form persistence
 */
export function useApplicationSession<T extends FieldValues>({
  formType,
  watch,
  reset,
  autoSaveDelay = 2000
}: UseApplicationSessionOptions<T>): UseApplicationSessionReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [applicationDetails, setApplicationDetails] = useState<{
    customerEmail?: string;
    customerName?: string;
    travelMethod?: string;
    travelType?: string;
  }>();
  
  const searchParams = useSearchParams();
  const stripeSessionId = searchParams.get('session_id');
  
  const sessionManagerRef = useRef<ApplicationSessionManager | null>(null);
  const watchedValues = watch();
  const hasLoadedRef = useRef(false);

  // Initialize application session manager
  useEffect(() => {
    const initializeSession = async () => {
      sessionManagerRef.current = new ApplicationSessionManager(stripeSessionId || undefined);
      
      if (stripeSessionId) {
        console.log('🔗 Initializing payment-linked session:', stripeSessionId.substring(0, 8) + '...');
        const initResult = await sessionManagerRef.current.initializeFromPayment();
        
        if (!initResult.success) {
          console.error('Failed to initialize payment session:', initResult.error);
          setSaveError(initResult.error || 'Failed to initialize session');
          } else if (initResult.applicationDetails) {
            const details = initResult.applicationDetails as Record<string, unknown>;
            // Set application details from initialization
            setApplicationDetails({
              customerEmail: (details.customerEmail || details.customer_email) as string,
              customerName: (details.customerName || details.customer_name) as string,
              travelMethod: (details.travelMethod || details.travel_method) as string,
              travelType: (details.travelType || details.travel_type) as string
            });
          }
      }
      
      await loadFormData();
    };

    initializeSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formType, stripeSessionId]);

  /**
   * Load form data and application details
   */
  const loadFormData = useCallback(async () => {
    if (!sessionManagerRef.current || hasLoadedRef.current) return;

    setIsLoading(true);
    try {
      const result = await sessionManagerRef.current.loadFormData();
      
      if (result.success) {
        // Set application details if available
        if (result.applicationDetails) {
          setApplicationDetails(result.applicationDetails);
          console.log('📋 Application details loaded:', {
            email: result.applicationDetails.customerEmail,
            travel: `${result.applicationDetails.travelMethod} - ${result.applicationDetails.travelType}`
          });
        }

        // Populate form with saved data
        if (result.data && Object.keys(result.data).length > 0) {
          reset(result.data as T);
          console.log('✅ Form data loaded successfully');
        }
      } else {
        console.error('Error loading form data:', result.error);
        setSaveError(result.error || 'Failed to load form data');
      }
    } catch (error) {
      console.error('Error loading form data:', error);
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
      hasLoadedRef.current = true;
    }
  }, [reset]);

  /**
   * Save form data
   */
  const saveFormData = useCallback(async (formData: Record<string, unknown>) => {
    if (!sessionManagerRef.current) return;

    setSaveStatus('saving');
    setSaveError(null);

    try {
      const result = await sessionManagerRef.current.saveFormData({
        formData,
        currentStep: 'form-entry'
      });

      if (result.success) {
        setSaveStatus('saved');
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

  // Create debounced save function
  const debouncedSave = useRef(
    debounce((formData: Record<string, unknown>) => {
      saveFormData(formData);
    }, autoSaveDelay)
  ).current;

  // Auto-save when form values change
  useEffect(() => {
    if (!hasLoadedRef.current || isLoading) return;
    
    const filteredData = Object.entries(watchedValues)
      .filter(([, value]) => {
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

    if (Object.keys(filteredData).length > 0) {
      debouncedSave(filteredData);
    }
  }, [watchedValues, debouncedSave, isLoading]);

  /**
   * Manual save function
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
   * Clear form data
   */
  const clearForm = useCallback(async () => {
    if (!sessionManagerRef.current) return;

    try {
      await sessionManagerRef.current.clearSession();
      
      reset();
      setApplicationDetails(undefined);
      setSaveStatus('idle');
      setSaveError(null);
      console.log('🧹 Form cleared successfully');
    } catch (error) {
      console.error('Error clearing form:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to clear form');
    }
  }, [reset]);

  return {
    isLoading,
    saveStatus,
    saveError,
    applicationDetails,
    manualSave,
    clearForm,
    sessionToken: sessionManagerRef.current?.getSessionToken() || '',
    stripeSessionId: sessionManagerRef.current?.getStripeSessionId()
  };
}
