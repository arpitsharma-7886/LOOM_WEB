import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, selectedSize, selectedColor) => {

        console.log(selectedSize, 'selectedsize');
        console.log(selectedColor, 'selectedColor');
        
        
        const items = get().items;

        const productId = product.productId || product._id; // Fallback if _id is ever used
        const colorName = selectedColor?.value || selectedColor?.name || 'default';
        const colorImage = selectedColor?.image || product.thumbnailImage;

        const existingItemIndex = items.findIndex(
          item =>
            item.id === productId &&
            item.size === selectedSize &&
            item.color === colorName
        );

        if (existingItemIndex !== -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += 1;
          set({ items: updatedItems });
        } else {
          set({
            items: [
              ...items,
              {
                id: productId,
                title: product.title,
                price: product.lowestSellingPrice || product.basePrice || 0,
                image: colorImage,
                size: selectedSize,
                color: colorName,
                quantity: 1,
              },
            ],
          });
        }
      },

      removeItem: (id, size, color) => {
        set({
          items: get().items.filter(
            item => !(item.id === id && item.size === size && item.color === color)
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
