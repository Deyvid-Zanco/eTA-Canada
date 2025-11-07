import Cookies from 'js-cookie';

export interface FormPersistenceConfig {
  formType: 'flight' | 'cruise';
  maxLocalStorageSize?: number; // in bytes
  autoSaveDelay?: number; // in milliseconds
  sessionDurationDays?: number;
}

export interface FormData {
  [key: string]: unknown;
}

export class HybridFormPersistence {
  private config: FormPersistenceConfig;
  public sessionToken: string;
  private readonly COOKIE_NAME = 'philippines_form_session';
  private readonly BASE_STORAGE_KEY: string;
  
  constructor(config: FormPersistenceConfig) {
    this.config = {
      maxLocalStorageSize: 2 * 1024 * 1024, // 2MB default
      autoSaveDelay: 2000, // 2 seconds
      sessionDurationDays: 365, // 1 year default - data persists as long as cookie exists
      ...config
    };
    
    // Base key without mode - we'll add mode to make keys mode-specific
    this.BASE_STORAGE_KEY = `${config.formType}_form_draft`;
    this.sessionToken = this.getOrCreateSessionToken();
  }

  /**
   * Get mode-specific storage key
   */
  private getStorageKey(mode: string): string {
    return `${this.BASE_STORAGE_KEY}_${mode}`;
  }

  /**
   * Get mode-specific mode key (for backwards compatibility)
   */
  private getModeKey(mode: string): string {
    return `${this.BASE_STORAGE_KEY}_${mode}_mode`;
  }

  /**
   * Get or create session token for tracking
   */
  private getOrCreateSessionToken(): string {
    const existingToken = Cookies.get(this.COOKIE_NAME);
    
    if (existingToken) {
      return existingToken;
    }

    // Create new session token
    const newToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Set cookie with expiration (only stores session ID, not form data)
    Cookies.set(this.COOKIE_NAME, newToken, {
      expires: this.config.sessionDurationDays,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return newToken;
  }

  /**
   * Save form data with intelligent storage strategy
   */
  async saveFormData(formData: FormData, mode: string): Promise<{ success: boolean; error?: string; method?: string }> {
    try {
      // Refresh/update cookie expiration on each save to extend session
      const existingToken = Cookies.get(this.COOKIE_NAME);
      if (existingToken) {
        Cookies.set(this.COOKIE_NAME, existingToken, {
          expires: this.config.sessionDurationDays,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
      
      const dataToSave = {
        ...formData,
        mode,
        timestamp: Date.now(),
        sessionToken: this.sessionToken
      };

      const serializedData = JSON.stringify(dataToSave);
      const dataSize = new Blob([serializedData]).size;

      // Get mode-specific storage keys
      const storageKey = this.getStorageKey(mode);
      const modeKey = this.getModeKey(mode);

      // Strategy 1: Try localStorage first (for most cases)
      if (dataSize <= this.config.maxLocalStorageSize!) {
        localStorage.setItem(storageKey, serializedData);
        localStorage.setItem(modeKey, mode);
        console.log(`✅ [${this.config.formType}] Form data saved to localStorage: ${storageKey} (${(dataSize / 1024).toFixed(1)}KB, mode: ${mode})`);
        return { success: true, method: 'localStorage' };
      }

      // Strategy 2: Compress and try localStorage again
      const compressedData = await this.compressData(dataToSave);
      const compressedSize = new Blob([compressedData]).size;
      
      if (compressedSize <= this.config.maxLocalStorageSize!) {
        localStorage.setItem(storageKey, compressedData);
        localStorage.setItem(modeKey, mode);
        console.log(`✅ [${this.config.formType}] Form data saved to localStorage (compressed): ${storageKey} (${(compressedSize / 1024).toFixed(1)}KB, mode: ${mode})`);
        return { success: true, method: 'localStorage-compressed' };
      }

      // Strategy 3: Split data and use multiple localStorage keys
      const splitData = this.splitData(dataToSave);
      let allSaved = true;
      
      for (const [key, value] of Object.entries(splitData)) {
        try {
          localStorage.setItem(`${storageKey}_${key}`, JSON.stringify(value));
        } catch (error) {
          console.warn(`Failed to save chunk ${key}:`, error);
          allSaved = false;
        }
      }
      
      if (allSaved) {
        localStorage.setItem(modeKey, mode);
        console.log(`✅ [${this.config.formType}] Form data saved to localStorage (split): ${storageKey} (${Object.keys(splitData).length} chunks, mode: ${mode})`);
        return { success: true, method: 'localStorage-split' };
      }

      // Strategy 4: Fallback to sessionStorage (temporary)
      sessionStorage.setItem(storageKey, serializedData);
      sessionStorage.setItem(modeKey, mode);
      console.log(`⚠️ [${this.config.formType}] Form data saved to sessionStorage (fallback): ${storageKey} (${(dataSize / 1024).toFixed(1)}KB, mode: ${mode})`);
      return { success: true, method: 'sessionStorage' };

    } catch (error) {
      console.error('❌ Error saving form data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Load form data with intelligent retrieval strategy
   */
  async loadFormData(mode: string): Promise<{ success: boolean; data?: FormData; error?: string; method?: string }> {
    try {
      // Refresh cookie expiration on load to extend session
      const existingToken = Cookies.get(this.COOKIE_NAME);
      if (existingToken) {
        Cookies.set(this.COOKIE_NAME, existingToken, {
          expires: this.config.sessionDurationDays,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
      
      // Get mode-specific storage keys
      const storageKey = this.getStorageKey(mode);
      const modeKey = this.getModeKey(mode);
      
      // Try localStorage first
      const savedData = localStorage.getItem(storageKey);
      const savedMode = localStorage.getItem(modeKey);
      
      if (savedData && savedMode === mode) {
        const parsedData = JSON.parse(savedData);
        
        // Check if data is compressed
        if (parsedData.compressed) {
          const decompressedData = await this.decompressData(savedData);
          return this.validateAndReturnData(decompressedData, mode, 'localStorage-compressed');
        }
        
        return this.validateAndReturnData(parsedData, mode, 'localStorage');
      }

      // Try split localStorage data
      const splitData = this.loadSplitData(mode);
      if (splitData) {
        return this.validateAndReturnData(splitData, mode, 'localStorage-split');
      }

      // Try sessionStorage as fallback
      const sessionData = sessionStorage.getItem(storageKey);
      const sessionMode = sessionStorage.getItem(modeKey);
      
      if (sessionData && sessionMode === mode) {
        const parsedData = JSON.parse(sessionData);
        return this.validateAndReturnData(parsedData, mode, 'sessionStorage');
      }

      return { success: false, error: 'No saved data found' };

    } catch (error) {
      console.error('❌ Error loading form data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Validate and return data - persists as long as cookie exists
   */
  private validateAndReturnData(data: Record<string, unknown>, mode: string, method: string): { success: boolean; data?: FormData; method?: string; error?: string } {
    // Check if cookie still exists - if cookie exists, session is valid
    const cookieExists = Cookies.get(this.COOKIE_NAME);
    
    // If cookie doesn't exist, session has expired
    if (!cookieExists) {
      console.log(`ℹ️ [${this.config.formType}] Cookie expired, clearing saved data for mode: ${mode}`);
      this.clearSavedData(mode); // Only clear the specific mode
      return { success: false, error: 'Session cookie has expired' };
    }
    
    // Verify sessionToken matches (optional - allows multiple tabs/sessions)
    // If sessionToken doesn't match, it might be from a different session
    // We'll still load it if the cookie exists, but warn
    const savedSessionToken = data.sessionToken as string;
    if (savedSessionToken && savedSessionToken !== this.sessionToken) {
      console.warn(`⚠️ [${this.config.formType}] Session token mismatch, but cookie exists - loading anyway`);
    }
    
    // Remove metadata before returning
    const formData = { ...data };
    delete formData.timestamp;
    delete formData.mode;
    delete formData.sessionToken;
    delete formData.compressed;
    
    return { success: true, data: formData, method };
  }

  /**
   * Split large data into smaller chunks
   */
  private splitData(data: FormData): Record<string, unknown> {
    const chunks: Record<string, unknown> = {};
    const chunkSize = 500000; // 500KB per chunk
    const serialized = JSON.stringify(data);
    
    for (let i = 0; i < serialized.length; i += chunkSize) {
      const chunk = serialized.slice(i, i + chunkSize);
      chunks[`chunk_${Math.floor(i / chunkSize)}`] = {
        data: chunk,
        index: Math.floor(i / chunkSize),
        total: Math.ceil(serialized.length / chunkSize)
      };
    }
    
    return chunks;
  }

  /**
   * Load split data from localStorage
   */
  private loadSplitData(mode: string): FormData | null {
    try {
      const storageKey = this.getStorageKey(mode);
      const chunks: Record<string, unknown> = {};
      let chunkIndex = 0;
      
      // Load all chunks for this specific mode
      while (true) {
        const chunkKey = `${storageKey}_chunk_${chunkIndex}`;
        const chunkData = localStorage.getItem(chunkKey);
        
        if (!chunkData) break;
        
        const parsedChunk = JSON.parse(chunkData);
        chunks[`chunk_${chunkIndex}`] = parsedChunk;
        chunkIndex++;
      }
      
      if (Object.keys(chunks).length === 0) return null;
      
      // Reconstruct original data
      const sortedChunks = Object.values(chunks).sort((a: unknown, b: unknown) => {
        const aChunk = a as { index: number };
        const bChunk = b as { index: number };
        return aChunk.index - bChunk.index;
      });
      const reconstructedData = sortedChunks.map((chunk: unknown) => {
        const chunkData = chunk as { data: string };
        return chunkData.data;
      }).join('');
      
      return JSON.parse(reconstructedData);
    } catch (error) {
      console.error('Error loading split data:', error);
      return null;
    }
  }

  /**
   * Simple compression using JSON stringify with reduced precision
   */
  private async compressData(data: FormData): Promise<string> {
    // Remove empty values and compress numbers
    const compressed = JSON.stringify(data, (key, value) => {
      if (value === null || value === undefined || value === '') return undefined;
      if (typeof value === 'number') return Math.round(value * 100) / 100; // Round to 2 decimal places
      return value;
    });
    
    return JSON.stringify({ compressed: true, data: compressed });
  }

  /**
   * Decompress data
   */
  private async decompressData(compressedData: string): Promise<FormData> {
    const parsed = JSON.parse(compressedData);
    return JSON.parse(parsed.data);
  }

  /**
   * Clear saved form data - optionally for a specific mode
   * @param mode - If provided, only clears data for this mode. If not provided, clears all modes.
   */
  clearSavedData(mode?: string): void {
    try {
      if (mode) {
        // Clear data for specific mode only
        const storageKey = this.getStorageKey(mode);
        const modeKey = this.getModeKey(mode);
        
        localStorage.removeItem(storageKey);
        localStorage.removeItem(modeKey);
        
        // Clear split chunks for this mode
        let chunkIndex = 0;
        while (true) {
          const chunkKey = `${storageKey}_chunk_${chunkIndex}`;
          if (localStorage.getItem(chunkKey)) {
            localStorage.removeItem(chunkKey);
            chunkIndex++;
          } else {
            break;
          }
        }
        
        sessionStorage.removeItem(storageKey);
        sessionStorage.removeItem(modeKey);
        
        console.log(`✅ [${this.config.formType}] Saved form data cleared for mode: ${mode}`);
      } else {
        // Clear all modes (arrival and departure)
        const modes = ['arrival', 'departure'];
        for (const m of modes) {
          const storageKey = this.getStorageKey(m);
          const modeKey = this.getModeKey(m);
          
          localStorage.removeItem(storageKey);
          localStorage.removeItem(modeKey);
          
          // Clear split chunks for this mode
          let chunkIndex = 0;
          while (true) {
            const chunkKey = `${storageKey}_chunk_${chunkIndex}`;
            if (localStorage.getItem(chunkKey)) {
              localStorage.removeItem(chunkKey);
              chunkIndex++;
            } else {
              break;
            }
          }
          
          sessionStorage.removeItem(storageKey);
          sessionStorage.removeItem(modeKey);
        }
        
        console.log(`✅ [${this.config.formType}] All saved form data cleared (all modes)`);
      }
    } catch (error) {
      console.error('Error clearing saved data:', error);
    }
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): { localStorage: number; sessionStorage: number; total: number } {
    let localStorageSize = 0;
    let sessionStorageSize = 0;
    
    try {
      // Calculate localStorage usage for all modes
      for (const key in localStorage) {
        if (key.startsWith(this.BASE_STORAGE_KEY)) {
          localStorageSize += localStorage[key].length;
        }
      }
      
      // Calculate sessionStorage usage for all modes
      for (const key in sessionStorage) {
        if (key.startsWith(this.BASE_STORAGE_KEY)) {
          sessionStorageSize += sessionStorage[key].length;
        }
      }
    } catch (error) {
      console.error('Error calculating storage stats:', error);
    }
    
    return {
      localStorage: localStorageSize,
      sessionStorage: sessionStorageSize,
      total: localStorageSize + sessionStorageSize
    };
  }
}
