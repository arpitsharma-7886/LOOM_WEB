import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useAddresses = create((set, get) => ({
  addresses: [],
  loading: false,
  error: null,

  fetchAddresses: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) throw error;
      set({ addresses: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addAddress: async (address) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert([address])
        .select();

      if (error) throw error;
      set(state => ({ 
        addresses: [...state.addresses, data[0]], 
        loading: false 
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateAddress: async (id, updates) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      set(state => ({
        addresses: state.addresses.map(addr => 
          addr.id === id ? data[0] : addr
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteAddress: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        addresses: state.addresses.filter(addr => addr.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setDefaultAddress: async (id) => {
    set({ loading: true });
    try {
      // First, remove default from all addresses
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .neq('id', id);

      // Then set the new default
      const { data, error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      // Update local state
      set(state => ({
        addresses: state.addresses.map(addr => ({
          ...addr,
          is_default: addr.id === id
        })),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

export default useAddresses;