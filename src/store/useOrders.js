import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useOrders = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ orders: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createOrder: async (orderData, items) => {
    set({ loading: true });
    try {
      // Start a transaction
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          total_amount: orderData.totalAmount,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      set({ loading: false });
      return order;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  }
}));

export default useOrders;