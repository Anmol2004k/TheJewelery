import { supabase, isSupabaseConfigured, UserProfile } from '../lib/supabase';

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
        .single();

      if (error) {
        return null;
      }
      return data as UserProfile;
    } catch (err) {
      console.warn('Get profile error:', err);
      return null;
    }
  },

  /**
   * Upsert profile data
   */
  async upsertProfile(profile: Partial<UserProfile> & { id: string; email: string }) {
    if (!isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as UserProfile;
    } catch (err) {
      console.warn('Upsert profile notice:', err);
      return null;
    }
  },

  /**
   * Fetch all user accounts (Admin)
   */
  async getAllUsers(): Promise<any[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((u: any) => ({
            id: u.id,
            email: u.email,
            displayName: u.display_name || u.email.split('@')[0],
            photoURL: u.avatar_url,
            role: u.role || 'customer',
            createdAt: u.created_at,
            totalOrders: u.total_orders || 0,
            totalSpend: u.total_spend || 0,
          }));
        }
      } catch (err) {
        console.warn('Supabase getAllUsers notice:', err);
      }
    }

    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return await res.json();
    return [];
  },
};
