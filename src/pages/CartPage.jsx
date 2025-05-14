import React from 'react';
import MainTemplate from '../components/MainTemplate';
import useCart from '../store/useCart';
import { Minus, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { items, removeItem, updateQuantity, getTotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <MainTemplate>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-8">Shopping Cart ({items.length} items)</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            {items.map((item, index) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="flex gap-4 border-b py-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-32 object-cover rounded-md"
                />
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.title}</h3>
                    <button
                      onClick={() => removeItem(item.id, item.size, item.color)}
                      className="text-gray-400 hover:text-black"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Size: {item.size}</p>
                    <p>Color: {item.color}</p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.size, item.color, item.quantity - 1);
                          }
                        }}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 py-1 border-x">{item.quantity}</span>
                      <button
                        onClick={() => {
                          updateQuantity(item.id, item.size, item.color, item.quantity + 1);
                        }}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="font-medium">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between border-t pt-3 font-medium text-base">
                  <span>Total</span>
                  <span>₹{getTotal()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white py-3 rounded-md mt-6 hover:bg-gray-800"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full border border-black py-3 rounded-md mt-3 hover:bg-gray-50"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default CartPage;