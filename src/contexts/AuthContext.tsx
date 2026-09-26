import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import {
  supabase,
  signInWithGoogle as sbSignInWithGoogle,
  signInWithEmail as sbSignInWithEmail,
  signUpWithEmail as sbSignUpWithEmail,
  logOut as sbLogOut,
  UserProfile,
} from '../lib/supabase';
import { profileService } from '../services/profileService';

export interface AppUser {
  id: string;
  uid: string; // Alias for backward compatibility
  email?: string;
  displayName?: string;
  photoURL?: string;
  role: 'customer' | 'admin';
  rawUser: SupabaseUser;
}

interface AuthContextType {
  user: AppUser | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: (redirectPath?: string) => Promise<any>;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signUpWithEmail: (
    email: string,
    pass: string,
    meta?: { firstName?: string; lastName?: string; fullName?: string }
  ) => Promise<any>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  logOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const syncUserSession = async (session: Session | null) => {
    if (!session?.user) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    const sbUser = session.user;
    const metadata = sbUser.user_metadata || {};
    const email = sbUser.email || '';
    const displayName =
      metadata.full_name ||
      metadata.name ||
      metadata.display_name ||
      `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() ||
      email.split('@')[0];
    const photoURL = metadata.avatar_url || metadata.picture || '';

    // Check if designated admin
    const isAdminEmail = email.toLowerCase() === 'theadultanmol@gmail.com';
    let userRole: 'customer' | 'admin' = isAdminEmail ? 'admin' : (metadata.role as any) || 'customer';

    // Try fetching database profile
    let dbProfile = await profileService.getProfile(sbUser.id);
    if (dbProfile) {
      userRole = dbProfile.role || userRole;
      setProfile(dbProfile);
    } else {
      // Upsert default profile
      const newProf = await profileService.upsertProfile({
        id: sbUser.id,
        email,
        display_name: displayName,
        avatar_url: photoURL,
        role: userRole,
      });
      if (newProf) setProfile(newProf);
    }

    const appUser: AppUser = {
      id: sbUser.id,
      uid: sbUser.id, // Backward compatibility
      email,
      displayName,
      photoURL,
      role: userRole,
      rawUser: sbUser,
    };

    setUser(appUser);

    // Sync with server store for admin overview
    fetch('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: sbUser.id,
        email,
        displayName,
        photoURL,
        role: userRole,
        createdAt: sbUser.created_at || new Date().toISOString(),
      }),
    }).catch((e) => console.warn('User admin sync notice:', e));

    setLoading(false);
  };

  useEffect(() => {
    // 1. Check initial active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUserSession(session);
    });

    // 2. Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUserSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async (redirectPath: string = '/orders') => {
    return sbSignInWithGoogle(redirectPath);
  };

  const handleEmailSignIn = async (email: string, pass: string) => {
    const res = await sbSignInWithEmail(email, pass);
    if (res.session) {
      await syncUserSession(res.session);
    }
    return res;
  };

  const handleEmailSignUp = async (
    email: string,
    pass: string,
    meta?: { firstName?: string; lastName?: string; fullName?: string }
  ) => {
    const res = await sbSignUpWithEmail(email, pass, meta);
    if (res.session) {
      await syncUserSession(res.session);
    }
    return res;
  };

  const handleLogOut = async () => {
    await sbLogOut();
    setUser(null);
    setProfile(null);
  };

  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === 'theadultanmol@gmail.com';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        loading,
        signInWithGoogle: handleGoogleSignIn,
        signInWithEmail: handleEmailSignIn,
        signUpWithEmail: handleEmailSignUp,
        logOut: handleLogOut,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
