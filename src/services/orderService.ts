import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface OrderItemInput {
  product: {
    id: string;
    name: string;
    price: number;
    category?: string;
    image?: string;
  };
  quantity: number;
}

export interface CreateOrderPayload {
  userId?: string;
  orderId: string;
  amount: number;
  currency?: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  items: OrderItemInput[];
  status?: 'paid' | 'processing' | 'shipped' | 'delivered' | 'failed' | 'cancelled';
  paymentId?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface SupabaseOrderRecord {
  id: string;
  order_id: string;
  user_id?: string | null;
  email: string;
  phone?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  country?: string | null;
  amount: number;
  currency: string;
  status: string;
  payment_id?: string | null;
  payment_method?: string | null;
  tracking_courier?: string | null;
  tracking_id?: string | null;
  notes?: string | null;
  created_at: string;
  order_items?: {
    id: string;
    product_id: string;
    product_name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  // Backward compatibility alias
  items?: any[];
}

export const orderService = {
  /**
   * Create an order in Supabase with normalized order_items, and sync to backend
   */
  async createOrder(payload: CreateOrderPayload) {
    const id = payload.orderId;
    let supabaseSuccess = false;

    if (isSupabaseConfigured) {
      try {
        // 1. Insert order header into public.orders
        const { error: orderErr } = await supabase.from('orders').upsert({
          id,
          order_id: payload.orderId,
          user_id: payload.userId && payload.userId !== 'guest' ? payload.userId : null,
          email: payload.email,
          phone: payload.phone || '',
          first_name: payload.firstName,
          last_name: payload.lastName,
          address: payload.address,
          city: payload.city,
          state: payload.state,
          pincode: payload.pincode,
          country: payload.country || 'India',
          amount: payload.amount,
          currency: payload.currency || 'INR',
          status: payload.status || 'paid',
          payment_id: payload.paymentId || '',
          payment_method: payload.paymentMethod || 'Razorpay',
          notes: payload.notes || '',
          created_at: new Date().toISOString(),
        });

        if (!orderErr) {
          supabaseSuccess = true;
          // 2. Insert items into public.order_items
          if (payload.items && payload.items.length > 0) {
            const itemsRows = payload.items.map((item) => ({
              order_id: id,
              product_id: item.product?.id || '',
              product_name: item.product?.name || 'Jewelry Piece',
              price: item.product?.price || 0,
              quantity: item.quantity || 1,
              image: item.product?.image || '',
              category: item.product?.category || 'Jewelry',
            }));

            await supabase.from('order_items').insert(itemsRows);
          }
        } else {
          console.warn('Supabase orders insert notice:', orderErr.message);
        }
      } catch (err) {
        console.warn('Supabase createOrder exception:', err);
      }
    }

    // 3. Always sync to backend server store as well
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          orderId: payload.orderId,
          userId: payload.userId,
          amount: payload.amount,
          currency: payload.currency || 'INR',
          email: payload.email,
          phone: payload.phone,
          firstName: payload.firstName,
          lastName: payload.lastName,
          address: payload.address,
          city: payload.city,
          state: payload.state,
          pincode: payload.pincode,
          country: payload.country || 'India',
          items: payload.items,
          status: payload.status || 'paid',
          paymentId: payload.paymentId,
          createdAt: new Date().toISOString(),
        }),
      });
    } catch (apiErr) {
      console.warn('Backend order sync warning:', apiErr);
    }

    return { id, success: true, supabaseSuccess };
  },

  /**
   * Fetch customer orders (using RLS when authenticated)
   */
  async getUserOrders(userId?: string, email?: string): Promise<any[]> {
    if (!userId && !email) return [];

    // Attempt Supabase fetch first
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (userId && userId !== 'guest') {
          query = query.eq('user_id', userId);
        } else if (email) {
          query = query.eq('email', email.trim().toLowerCase());
        }

        const { data, error } = await query;

        if (!error && data && data.length > 0) {
          // Normalize items format for frontend components
          return data.map((ord: any) => ({
            ...ord,
            orderId: ord.order_id || ord.id,
            firstName: ord.first_name,
            lastName: ord.last_name,
            items: (ord.order_items || []).map((it: any) => ({
              product: {
                id: it.product_id,
                name: it.product_name,
                price: it.price,
                image: it.image,
              },
              quantity: it.quantity,
            })),
          }));
        }
      } catch (sbErr) {
        console.warn('Supabase getUserOrders notice:', sbErr);
      }
    }

    // Fallback to server store
    try {
      const res = await fetch('/api/orders/my-orders', {
        headers: {
          'x-user-id': userId || '',
          'x-user-email': email || '',
        },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Server fallback order fetch error:', e);
    }

    return [];
  },

  /**
   * Fetch all orders (Admin access)
   */
  async getAllOrders(): Promise<any[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((ord: any) => ({
            ...ord,
            orderId: ord.order_id || ord.id,
            firstName: ord.first_name,
            lastName: ord.last_name,
            items: (ord.order_items || []).map((it: any) => ({
              product: {
                id: it.product_id,
                name: it.product_name,
                price: it.price,
                image: it.image,
              },
              quantity: it.quantity,
            })),
          }));
        }
      } catch (err) {
        console.warn('Supabase getAllOrders notice:', err);
      }
    }

    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return await res.json();
    return [];
  },

  /**
   * Update order status
   */
  async updateStatus(orderId: string, status: string) {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Supabase update status notice:', err);
      }
    }

    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
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
   * Delete order
   */
  async deleteOrder(orderId: string) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('orders').delete().eq('id', orderId);
      } catch (err) {
        console.warn('Supabase delete order notice:', err);
      }
    }

    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  },
};
