import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, selectedSize, selectedColor) => {
        const items = get().items;
        const existingItem = items.find(
          item => 
            item.id === product._id && 
            item.size === selectedSize && 
            item.color === selectedColor.name
        );

        if (existingItem) {
          set({
            items: items.map(item =>
              item === existingItem
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product._id,
                title: product.title,
                price: product.lowestSellingPrice,
                image: selectedColor.image,
                size: selectedSize,
                color: selectedColor.name,
                quantity: 1,
              },
            ],
          });
        }
      },
      removeItem: (id, size, color) => {
        set({
          items: get().items.filter(
            item => 
              !(item.id === id && item.size === size && item.color === color)
          ),
        });
      },
      updateQuantity: (id, size, color, quantity) => {
        set({
          items: get().items.map(item =>
            item.id === id && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCart;