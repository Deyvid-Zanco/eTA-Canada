import { supabase } from './supabase';
import Cookies from 'js-cookie';

export interface ApplicationSession {
  id: string;
  stripe_session_id: string;
  customer_email: string;
  customer_name?: string;
  travel_method: 'Flight' | 'Cruise';
  travel_type: 'arrival' | 'departure';
  form_session_token: string;
  form_data: Record<string, unknown>;
  current_step?: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  completed: boolean;
}

/**
 * Enhanced persistence manager that links form sessions to payment sessions 1
 */
export class ApplicationSessionManager {
  private formSessionToken: string;
  private stripeSessionId?: string;
  private readonly COOKIE_NAME = 'philippines_form_session';
  private readonly SESSION_DURATION_DAYS = 7;

  constructor(stripeSessionId?: string) {
    this.stripeSessionId = stripeSessionId;
    this.formSessionToken = this.getOrCreateSessionToken();
  }

  /**
   * Get or create session token, tied to Stripe session if provided
   */
  private getOrCreateSessionToken(): string {
    // If we have a Stripe session ID, use that as the basis for the token
    if (this.stripeSessionId) {
      const existingToken = Cookies.get(this.COOKIE_NAME);
      
      // Check if existing token is already tied to this payment
      if (existingToken && existingToken.includes(this.stripeSessionId.substring(0, 8))) {
        return existingToken;
      }

      // Create new token based on Stripe session
      const newToken = `${this.stripeSessionId}_${Date.now()}`;
      
      Cookies.set(this.COOKIE_NAME, newToken, {
        expires: this.SESSION_DURATION_DAYS,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      return newToken;
    }

    // Fallback to regular UUID if no Stripe session
    const existingToken = Cookies.get(this.COOKIE_NAME);
    if (existingToken) {
      return existingToken;
    }

    const newToken = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    Cookies.set(this.COOKIE_NAME, newToken, {
      expires: this.SESSION_DURATION_DAYS,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return newToken;
  }

  /**
   * Initialize application session from Stripe payment data
   */
  async initializeFromPayment(): Promise<{ success: boolean; error?: string; applicationDetails?: unknown }> {
    if (!this.stripeSessionId) {
      return { success: true }; // No Stripe session, proceed with regular session
    }

    try {
      // Call the server-side API to handle Stripe operations
      const response = await fetch('/api/application-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stripeSessionId: this.stripeSessionId,
          formSessionToken: this.formSessionToken
        }),
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, error: result.error };
      }

      // If there was an existing session, update our token
      if (result.existingSession) {
        Cookies.set(this.COOKIE_NAME, result.existingSession.form_session_token, {
          expires: this.SESSION_DURATION_DAYS,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        this.formSessionToken = result.existingSession.form_session_token;
      }

      return { 
        success: true, 
        applicationDetails: result.applicationDetails || result.existingSession 
      };

    } catch (error) {
      console.error('Error initializing application session:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Save form data with application context
   */
  async saveFormData(options: {
    formData: Record<string, unknown>;
    currentStep?: string;
    completed?: boolean;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { formData, currentStep, completed = false } = options;

      if (this.stripeSessionId) {
        // Update application_sessions table
        const { error } = await supabase
          .from('application_sessions')
          .update({
            form_data: formData,
            current_step: currentStep,
            completed,
            updated_at: new Date().toISOString()
          })
          .eq('form_session_token', this.formSessionToken);

        if (error) throw error;
      } else {
        // Fallback to form_sessions table for non-payment users
        const sessionData = {
          session_token: this.formSessionToken,
          form_type: 'flight', // Default, would need to be passed in
          form_data: formData,
          current_step: currentStep,
          completed,
          expires_at: new Date(Date.now() + (this.SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000)).toISOString()
        };

        const { data: existingSession } = await supabase
          .from('form_sessions')
          .select('id')
          .eq('session_token', this.formSessionToken)
          .single();

        if (existingSession) {
          const { error } = await supabase
            .from('form_sessions')
            .update(sessionData)
            .eq('session_token', this.formSessionToken);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('form_sessions')
            .insert(sessionData);

          if (error) throw error;
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error saving form data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Load form data and application details
   */
  async loadFormData(): Promise<{ 
    success: boolean; 
    data?: Record<string, unknown>; 
    currentStep?: string;
    applicationDetails?: {
      customerEmail?: string;
      customerName?: string;
      travelMethod?: string;
      travelType?: string;
    };
    completed?: boolean;
    error?: string;
  }> {
    try {
      if (this.stripeSessionId) {
        // Try to load from application_sessions
        const { data: session, error } = await supabase
          .from('application_sessions')
          .select('*')
          .eq('form_session_token', this.formSessionToken)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return { success: true, data: {} };
          }
          throw error;
        }

        if (session && new Date(session.expires_at) < new Date()) {
          return { success: true, data: {} };
        }

        return {
          success: true,
          data: session?.form_data || {},
          currentStep: session?.current_step,
          applicationDetails: {
            customerEmail: session?.customer_email,
            customerName: session?.customer_name,
            travelMethod: session?.travel_method,
            travelType: session?.travel_type
          },
          completed: session?.completed || false
        };
      } else {
        // Fallback to form_sessions table
        const { data: session, error } = await supabase
          .from('form_sessions')
          .select('*')
          .eq('session_token', this.formSessionToken)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return { success: true, data: {} };
          }
          throw error;
        }

        if (session && new Date(session.expires_at) < new Date()) {
          return { success: true, data: {} };
        }

        return {
          success: true,
          data: session?.form_data || {},
          currentStep: session?.current_step,
          completed: session?.completed || false
        };
      }
    } catch (error) {
      console.error('Error loading form data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get session token for debugging
   */
  getSessionToken(): string {
    return this.formSessionToken;
  }

  /**
   * Get Stripe session ID
   */
  getStripeSessionId(): string | undefined {
    return this.stripeSessionId;
  }

  /**
   * Clear session
   */
  async clearSession(): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.stripeSessionId) {
        const { error } = await supabase
          .from('application_sessions')
          .delete()
          .eq('form_session_token', this.formSessionToken);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('form_sessions')
          .delete()
          .eq('session_token', this.formSessionToken);

        if (error) throw error;
      }

      Cookies.remove(this.COOKIE_NAME);
      return { success: true };
    } catch (error) {
      console.error('Error clearing session:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
