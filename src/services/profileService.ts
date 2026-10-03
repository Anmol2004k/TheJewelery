import {
  supabase,
  isSupabaseConfigured,
  UserProfile,
} from '../lib/supabase';

export const profileService = {
  /**
   * Get profile by User ID
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (!userId || !isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Get profile error:', error);
        return null;
      }

      return data as UserProfile | null;
    } catch (err) {
      console.warn('Get profile error:', err);
      return null;
    }
  },

  /**
   * Create or update profile
   */
  async upsertProfile(
    profile: Partial<UserProfile> & {
      id: string;
      email: string;
    }
  ) {
    if (!isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            ...profile,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'id',
          }
        )
        .select()
        .single();

      if (error) {
        console.warn('Upsert profile error:', error);
        return null;
      }

      return data as UserProfile;
    } catch (err) {
      console.warn('Upsert profile error:', err);
      return null;
    }
  },

  /**
   * Fetch all user profiles.
   * Admin access is controlled by Supabase RLS.
   */
  async getAllUsers(): Promise<any[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase getAllUsers error:', error);
        return [];
      }

      return (data || []).map((u: any) => ({
        id: u.id,
        email: u.email,
        displayName: u.display_name || u.email?.split('@')[0] || 'User',
        photoURL: u.avatar_url,
        role: u.role || 'customer',
        createdAt: u.created_at,
        totalOrders: u.total_orders || 0,
        totalSpend: u.total_spend || 0,
      }));
    } catch (err) {
      console.error('Supabase getAllUsers error:', err);
      return [];
    }
  },
};

