import { supabase } from './supabase';
import Cookies from 'js-cookie';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  last_login?: string;
}

export class AdminAuth {
  private readonly ADMIN_COOKIE = 'philippines_admin_session';
  private readonly SESSION_DURATION_HOURS = 8; // 8 hour admin sessions

  /**
   * Admin login with email and password
   */
  async login(email: string, password: string): Promise<{ 
    success: boolean; 
    admin?: AdminUser;
    error?: string; 
  }> {
    try {
      // Check if admin exists and password matches
      const { data: admin, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('password_hash', this.hashPassword(password)) // In production, use proper bcrypt
        .single();

      if (error || !admin) {
        return { success: false, error: 'Invalid credentials' };
      }

      if (!admin.is_active) {
        return { success: false, error: 'Account is deactivated' };
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', admin.id);

      // Set session cookie
      const sessionToken = this.generateSessionToken();
      const sessionData = {
        admin_id: admin.id,
        session_token: sessionToken,
        expires_at: new Date(Date.now() + (this.SESSION_DURATION_HOURS * 60 * 60 * 1000)).toISOString()
      };

      await supabase.from('admin_sessions').insert(sessionData);

      Cookies.set(this.ADMIN_COOKIE, sessionToken, {
        expires: this.SESSION_DURATION_HOURS / 24, // Convert to days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      return {
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          created_at: admin.created_at,
          last_login: admin.last_login
        }
      };

    } catch (error) {
      console.error('Admin login error:', error);
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    }
  }

  /**
   * Get current admin user from session
   */
  async getCurrentAdmin(): Promise<AdminUser | null> {
    try {
      const sessionToken = Cookies.get(this.ADMIN_COOKIE);
      if (!sessionToken) return null;

      // Check if session is valid
      const { data: session, error } = await supabase
        .from('admin_sessions')
        .select(`
          admin_id,
          expires_at,
          admin_users!inner (
            id,
            email,
            name,
            role,
            created_at,
            last_login,
            is_active
          )
        `)
        .eq('session_token', sessionToken)
        .single();

      if (error || !session) return null;

      // Check if session expired
      if (new Date(session.expires_at) < new Date()) {
        await this.logout();
        return null;
      }

      const admin = Array.isArray(session.admin_users) ? session.admin_users[0] : session.admin_users;
      if (!admin?.is_active) return null;

      return {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        created_at: admin.created_at,
        last_login: admin.last_login
      };

    } catch (error) {
      console.error('Error getting current admin:', error);
      return null;
    }
  }

  /**
   * Admin logout
   */
  async logout(): Promise<void> {
    const sessionToken = Cookies.get(this.ADMIN_COOKIE);
    
    if (sessionToken) {
      // Remove session from database
      await supabase
        .from('admin_sessions')
        .delete()
        .eq('session_token', sessionToken);
    }

    // Remove cookie
    Cookies.remove(this.ADMIN_COOKIE);
  }

  /**
   * Check if user is authenticated admin
   */
  async isAuthenticated(): Promise<boolean> {
    const admin = await this.getCurrentAdmin();
    return admin !== null;
  }

  /**
   * Simple password hashing (use bcrypt in production)
   */
  private hashPassword(password: string): string {
    // This is a simple hash for demo - use bcrypt in production
    return Buffer.from(password + 'philippines_salt_2024').toString('base64');
  }

  /**
   * Generate secure session token
   */
  private generateSessionToken(): string {
    return `admin_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }

  /**
   * Create initial admin user (run this once)
   */
  async createInitialAdmin(email: string, password: string, name: string): Promise<{ 
    success: boolean; 
    error?: string; 
  }> {
    try {
      const adminData = {
        email: email.toLowerCase(),
        password_hash: this.hashPassword(password),
        name,
        role: 'super_admin',
        is_active: true
      };

      const { error } = await supabase
        .from('admin_users')
        .insert(adminData);

      if (error) throw error;

      return { success: true };

    } catch (error: unknown) {
      console.error('Error creating admin:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create admin user' 
      };
    }
  }
}

export const adminAuth = new AdminAuth();

// Admin database schema
export const ADMIN_SCHEMA = `
-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Add status and notes to application_sessions for admin management
ALTER TABLE application_sessions 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending' 
CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'completed'));

ALTER TABLE application_sessions 
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

ALTER TABLE application_sessions 
ADD COLUMN IF NOT EXISTS assigned_admin_id UUID REFERENCES admin_users(id);

-- Create trigger for admin_users updated_at
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired admin sessions
CREATE OR REPLACE FUNCTION cleanup_expired_admin_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ language 'plpgsql';
`;
