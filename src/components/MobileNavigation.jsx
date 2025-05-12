import React from 'react';
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react';

const MobileNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-top md:hidden z-40">
      <div className="flex justify-around py-3">
        <a href="#" className="flex flex-col items-center">
          <Home size={20} className="text-gray-700" />
          <span className="text-xs mt-1 text-gray-700">Home</span>
        </a>
        <a href="#" className="flex flex-col items-center">
          <Search size={20} className="text-gray-700" />
          <span className="text-xs mt-1 text-gray-700">Search</span>
        </a>
        <a href="#" className="flex flex-col items-center">
          <Heart size={20} className="text-gray-700" />
          <span className="text-xs mt-1 text-gray-700">Wishlist</span>
        </a>
        <a href="#" className="flex flex-col items-center relative">
          <ShoppingBag size={20} className="text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
            2
          </span>
          <span className="text-xs mt-1 text-gray-700">Bag</span>
        </a>
        <a href="#" className="flex flex-col items-center">
          <User size={20} className="text-gray-700" />
          <span className="text-xs mt-1 text-gray-700">Account</span>
        </a>
      </div>
    </div>
  );
};

export default MobileNavigation;
