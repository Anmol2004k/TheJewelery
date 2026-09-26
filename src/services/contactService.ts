import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface ContactMessagePayload {
  id?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  userId?: string | null;
  userEmail?: string | null;
  source?: string;
}

export const contactService = {
  /**
   * Submit contact form message to Supabase & backend
   */
  async sendMessage(payload: ContactMessagePayload) {
    const id = payload.id || `inq_${Date.now().toString().slice(-8)}`;
    let supabaseSuccess = false;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('contact_messages').insert({
          id,
          first_name: payload.firstName,
          last_name: payload.lastName,
          full_name: payload.fullName,
          email: payload.email.trim().toLowerCase(),
          subject: payload.subject,
          message: payload.message,
          status: 'unread',
          user_id: payload.userId && payload.userId !== 'guest' ? payload.userId : null,
          user_email: payload.userEmail || null,
          source: payload.source || 'contact_page',
          created_at: new Date().toISOString(),
        });

        if (!error) {
          supabaseSuccess = true;
        } else {
          console.warn('Supabase contact message insert notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase contactService error:', err);
      }
    }

    // Always sync with server store
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          firstName: payload.firstName,
          lastName: payload.lastName,
          fullName: payload.fullName,
          email: payload.email,
          subject: payload.subject,
          message: payload.message,
          status: 'unread',
          userId: payload.userId,
          userEmail: payload.userEmail,
          createdAt: new Date().toISOString(),
          source: payload.source || 'contact_page',
        }),
      });
    } catch (e) {
      console.warn('Server contact sync notice:', e);
    }

    return { id, success: true, supabaseSuccess };
  },

  /**
   * Fetch all contact messages (Admin)
   */
  async getAllMessages(): Promise<any[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((m: any) => ({
            ...m,
            firstName: m.first_name,
            lastName: m.last_name,
            fullName: m.full_name,
            createdAt: m.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase get messages notice:', err);
      }
    }

    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/admin/messages', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return await res.json();
    return [];
  },

  /**
   * Update message status (read / unread / replied)
   */
  async updateStatus(id: string, status: 'unread' | 'read' | 'replied') {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('contact_messages')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase update message notice:', err);
      }
    }

    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/admin/messages/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  },

  /**
   * Delete contact inquiry
   */
  async deleteMessage(id: string) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('contact_messages').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete message notice:', err);
      }
    }

    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  },
};
