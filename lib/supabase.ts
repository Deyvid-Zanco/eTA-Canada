import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with environment variables (provide fallbacks for build time)
const getSupabaseConfig = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  
  return {
    url: supabaseUrl,
    key: supabaseAnonKey
  };
};

const { url, key } = getSupabaseConfig();
export const supabase = createClient(url, key);

// Types for our database tables
export interface FormSession {
  id: string;
  session_token: string;
  form_type: 'flight' | 'cruise';
  form_data: Record<string, unknown>;
  current_step?: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  completed: boolean;
}

// Database schema SQL for reference
export const DATABASE_SCHEMA = `
-- Create form_sessions table for form persistence (legacy/fallback)
CREATE TABLE IF NOT EXISTS form_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  form_type VARCHAR(20) NOT NULL CHECK (form_type IN ('flight', 'cruise')),
  form_data JSONB NOT NULL DEFAULT '{}',
  current_step VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  completed BOOLEAN DEFAULT FALSE
);

-- Create application_sessions table for payment-linked form persistence
CREATE TABLE IF NOT EXISTS application_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  travel_method VARCHAR(20) NOT NULL CHECK (travel_method IN ('Flight', 'Cruise')),
  travel_type VARCHAR(20) NOT NULL CHECK (travel_type IN ('arrival', 'departure')),
  form_session_token VARCHAR(255) UNIQUE NOT NULL,
  form_data JSONB NOT NULL DEFAULT '{}',
  current_step VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  completed BOOLEAN DEFAULT FALSE
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_form_sessions_token ON form_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_form_sessions_expires ON form_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_application_sessions_stripe ON application_sessions(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_application_sessions_token ON application_sessions(form_session_token);
CREATE INDEX IF NOT EXISTS idx_application_sessions_email ON application_sessions(customer_email);
CREATE INDEX IF NOT EXISTS idx_application_sessions_expires ON application_sessions(expires_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_form_sessions_updated_at ON form_sessions;
CREATE TRIGGER update_form_sessions_updated_at
    BEFORE UPDATE ON form_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_application_sessions_updated_at ON application_sessions;
CREATE TRIGGER update_application_sessions_updated_at
    BEFORE UPDATE ON application_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM form_sessions WHERE expires_at < NOW();
    DELETE FROM application_sessions WHERE expires_at < NOW();
END;
$$ language 'plpgsql';
`;
