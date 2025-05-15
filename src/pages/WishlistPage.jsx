import React from 'react';
import MainTemplate from '../components/MainTemplate';
import useWishlist from '../store/useWishlist';
import { Heart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WishlistPage = () => {
  const { items, removeItem } = useWishlist();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <MainTemplate>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Heart size={48} className="text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
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
        <h1 className="text-2xl font-semibold mb-8">My Wishlist ({items.length} items)</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <div className="aspect-w-3 aspect-h-4 mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-lg cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                />
              </div>
              
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
              
              <h3 className="font-medium mb-2">{item.title}</h3>
              <p className="text-lg font-semibold">₹{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </MainTemplate>
  );
};

export default WishlistPage;