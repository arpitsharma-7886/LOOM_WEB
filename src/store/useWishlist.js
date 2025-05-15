import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlist = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        if (!items.some(item => item.id === product._id)) {
          set({ items: [...items, {
            id: product._id,
            title: product.title,
            price: product.lowestSellingPrice,
            image: product.images[0]?.url,
          }]});
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
      },
      isInWishlist: (id) => {
        return get().items.some(item => item.id === id);
      }
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

export default useWishlist;