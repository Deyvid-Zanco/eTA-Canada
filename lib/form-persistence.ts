import { supabase } from './supabase';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

export interface FormPersistenceOptions {
  formType: 'flight' | 'cruise';
  sessionDurationDays?: number;
}

export interface SaveFormDataOptions {
  formData: Record<string, unknown>;
  currentStep?: string;
  completed?: boolean;
}

export class FormPersistenceManager {
  private sessionToken: string;
  private formType: 'flight' | 'cruise';
  private readonly COOKIE_NAME = 'philippines_form_session';
  private readonly SESSION_DURATION_DAYS: number;

  constructor(options: FormPersistenceOptions) {
    this.formType = options.formType;
    this.SESSION_DURATION_DAYS = options.sessionDurationDays || 7;
    
    // Get existing session token or create new one
    this.sessionToken = this.getOrCreateSessionToken();
  }

  /**
   * Get existing session token from cookie or create a new one
   */
  private getOrCreateSessionToken(): string {
    const existingToken = Cookies.get(this.COOKIE_NAME);
    
    if (existingToken) {
      return existingToken;
    }

    // Create new session token
    const newToken = uuidv4();
    
    // Set cookie with expiration
    Cookies.set(this.COOKIE_NAME, newToken, {
      expires: this.SESSION_DURATION_DAYS,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return newToken;
  }

  /**
   * Save form data to database
   */
  async saveFormData(options: SaveFormDataOptions): Promise<{ success: boolean; error?: string }> {
    try {
      const { formData, currentStep, completed = false } = options;

      // Check if session already exists
      const { data: existingSession } = await supabase
        .from('form_sessions')
        .select('id')
        .eq('session_token', this.sessionToken)
        .single();

      const sessionData = {
        session_token: this.sessionToken,
        form_type: this.formType,
        form_data: formData,
        current_step: currentStep,
        completed,
        expires_at: new Date(Date.now() + (this.SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000)).toISOString()
      };

      if (existingSession) {
        // Update existing session
        const { error } = await supabase
          .from('form_sessions')
          .update(sessionData)
          .eq('session_token', this.sessionToken);

        if (error) throw error;
      } else {
        // Create new session
        const { error } = await supabase
          .from('form_sessions')
          .insert(sessionData);

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error saving form data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Load form data from database
   */
  async loadFormData(): Promise<{ 
    success: boolean; 
    data?: Record<string, unknown>; 
    currentStep?: string;
    completed?: boolean;
    error?: string;
  }> {
    try {
      const { data: session, error } = await supabase
        .from('form_sessions')
        .select('form_data, current_step, completed, expires_at')
        .eq('session_token', this.sessionToken)
        .eq('form_type', this.formType)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No session found - this is normal for new users
          return { success: true, data: {} };
        }
        throw error;
      }

      // Check if session has expired
      if (session && new Date(session.expires_at) < new Date()) {
        // Session expired, clean it up
        await this.clearSession();
        return { success: true, data: {} };
      }

      return {
        success: true,
        data: session?.form_data || {},
        currentStep: session?.current_step,
        completed: session?.completed || false
      };
    } catch (error) {
      console.error('Error loading form data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Clear current session data
   */
  async clearSession(): Promise<{ success: boolean; error?: string }> {
    try {
      // Remove from database
      const { error } = await supabase
        .from('form_sessions')
        .delete()
        .eq('session_token', this.sessionToken);

      if (error) throw error;

      // Remove cookie
      Cookies.remove(this.COOKIE_NAME);

      return { success: true };
    } catch (error) {
      console.error('Error clearing session:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Check if user has an existing session
   */
  async hasExistingSession(): Promise<boolean> {
    const result = await this.loadFormData();
    return result.success && !!result.data && Object.keys(result.data).length > 0;
  }

  /**
   * Get session token for debugging
   */
  getSessionToken(): string {
    return this.sessionToken;
  }

  /**
   * Mark form as completed
   */
  async markAsCompleted(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('form_sessions')
        .update({ completed: true })
        .eq('session_token', this.sessionToken);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error marking form as completed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
}

/**
 * Utility function to create a form persistence manager
 */
export function createFormPersistenceManager(formType: 'flight' | 'cruise'): FormPersistenceManager {
  return new FormPersistenceManager({ formType });
}

/**
 * Clean up expired sessions (can be called periodically)
 */
export async function cleanupExpiredSessions(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc('cleanup_expired_sessions');
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}
