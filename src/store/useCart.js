import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import useAuth from './useAuth';

const API_URL = 'http://192.168.29.92:3004';

const useCart = create(
    persist(
        (set, get) => ({
            cartData: null,
            loading: false,
            error: null,

            fetchCart: async () => {
                const { token } = useAuth.getState();
                if (!token) {
                    set({ cartData: null, error: 'Please login to view cart' });
                    return;
                }

                try {
                    set({ loading: true, error: null });
                    const response = await axios.get(`${API_URL}/cart/crt/get_cart`, {
                        headers: {
                            'accessToken': token
                        }
                    });

                    if (response.data.success) {
                        set({ cartData: response.data.data, error: null });
                    } else {
                        set({ error: response.data.message || 'Failed to fetch cart' });
                    }
                } catch (error) {
                    set({ error: error.response?.data?.message || 'Failed to fetch cart' });
                } finally {
                    set({ loading: false });
                }
            },

            addToCart: async (productId, variantId, quantity = 1) => {
                try {
                    set({ loading: true, error: null });
                    const token = localStorage.getItem('token');
                    
                    if (!token) {
                        set({ error: 'Please login to add items to cart' });
                        return false;
                    }

                    const response = await axios.post(`${API_URL}/cart/crt/add_item`, {
                        productId,
                        variantId,
                        quantity
                    }, {
                        headers: {
                            'accessToken': token
                        }
                    });

                    if (response.data.success) {
                        set({ 
                            cartData: response.data.data,
                            loading: false,
                            error: null
                        });
                        return true;
                    }
                    set({ 
                        error: response.data.message || 'Failed to add item to cart',
                        loading: false 
                    });
                    return false;
                } catch (error) {
                    console.error('Add to cart error:', error);
                    set({ 
                        error: error.response?.data?.message || error.message || 'Failed to add item to cart',
                        loading: false 
                    });
                    return false;
                }
            },

            removeItem: async (itemId) => {
                const { token } = useAuth.getState();
                if (!token) {
                    set({ error: 'Please login to remove items from cart' });
                    return false;
                }

                try {
                    set({ loading: true, error: null });
                    const response = await axios.delete(`${API_URL}/cart/crt/delete_item/${itemId}`, {
                        headers: {
                            'accessToken': token
                        }
                    });

                    if (response.data.success) {
                        await get().fetchCart();
                        return true;
                    } else {
                        set({ error: response.data.message || 'Failed to remove item from cart' });
                        return false;
                    }
                } catch (error) {
                    set({ error: error.response?.data?.message || 'Failed to remove item from cart' });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            updateQuantity: async (itemId, quantity) => {
                const { token } = useAuth.getState();
                if (!token) {
                    set({ error: 'Please login to update cart' });
                    return false;
                }

                try {
                    set({ loading: true, error: null });
                    const response = await axios.patch(`${API_URL}/cart/crt/update_item/${itemId}`, {
                        quantity
                    }, {
                        headers: {
                            'accessToken': token
                        }
                    });

                    if (response.data.success) {
                        await get().fetchCart();
                        return true;
                    } else {
                        set({ error: response.data.message || 'Failed to update quantity' });
                        return false;
                    }
                } catch (error) {
                    set({ error: error.response?.data?.message || 'Failed to update quantity' });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            // clearCart: async () => {
            //     const { token } = useAuth.getState();
            //     if (!token) {
            //         set({ error: 'Please login to clear cart' });
            //         return false;
            //     }

            //     try {
            //         set({ loading: true, error: null });
            //         const response = await axios.delete(`${API_URL}/cart/crt/clear_cart`, {
            //             headers: {
            //                 'accessToken': token
            //             }
            //         });

            //         if (response.data.success) {
            //             set({ cartData: null, error: null });
            //             return true;
            //         } else {
            //             set({ error: response.data.message || 'Failed to clear cart' });
            //             return false;
            //         }
            //     } catch (error) {
            //         set({ error: error.response?.data?.message || 'Failed to clear cart' });
            //         return false;
            //     } finally {
            //         set({ loading: false });
            //     }
            // },

            getTotalItems: () => {
                return get().cartData?.items.reduce((total, item) => total + item.quantity, 0) || 0;
            },

            getTotalPrice: () => {
                return get().cartData?.items.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
            }
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ cartData: state.cartData })
        }
    )
);

export default useCart;
