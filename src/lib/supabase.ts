import { createClient } from '@supabase/supabase-js';

// Supabase Credentials
// Configurable via environment variables with the project's defaults
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://oadkresiuupjythvdhtn.supabase.co';
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_GITyK1cTSoqpy1qYNzh-4A_Vu0CVnpz';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('placeholder')
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: 'customer' | 'admin';
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  country?: string | null;
  total_orders?: number;
  total_spend?: number;
  created_at?: string;
  updated_at?: string;
}

// ---------------------------------------------------------------------------
// AUTHENTICATION HELPERS
// ---------------------------------------------------------------------------

/**
 * Initiates Google OAuth Sign-in via Supabase Auth
 * Configured with production custom domain fallback: https://www.thejewelstudio.online
 */
export async function signInWithGoogle(redirectPath: string = '/orders') {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname.includes('ais-');
  const origin = isLocal ? window.location.origin : 'https://www.thejewelstudio.online';
  const redirectTo = `${origin}${redirectPath}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Supabase Google Sign-In error:', error);
    throw error;
  }
  return data;
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    console.error('Supabase Email Sign-In error:', error);
    throw error;
  }
  return data;
}

/**
 * Sign up with Email, Password and initial profile metadata
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: { firstName?: string; lastName?: string; fullName?: string }
) {
  const fullName =
    metadata?.fullName ||
    `${metadata?.firstName || ''} ${metadata?.lastName || ''}`.trim() ||
    email.split('@')[0];

  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        full_name: fullName,
        first_name: metadata?.firstName,
        last_name: metadata?.lastName,
      },
    },
  });

  if (error) {
    console.error('Supabase Sign-Up error:', error);
    throw error;
  }
  return data;
}

/**
 * Sign out of Supabase session
 */
export async function logOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (err) {
    console.error('Supabase Sign-Out error:', err);
    throw err;
  }
}

/**
 * Get current authenticated user session
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Fetch profile for a user
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // If table isn't created or row not found yet, return basic structure
      return null;
    }
    return data as UserProfile;
  } catch (err) {
    console.warn('Error fetching profile:', err);
    return null;
  }
}
