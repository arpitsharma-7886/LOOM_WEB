import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../store/useCart';

const Header = () => {
  const navigate = useNavigate();
  const { items } = useCart();

  return (
    <nav
      className="fixed bottom-0 z-50 w-full h-16 bg-white border-t border-gray-100 shadow safe-area-bottom"
      role="navigation"
      aria-label="Main navigation"
      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
    >
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        {/* Home */}
        <a
          href="/"
          aria-label="Home"
          aria-current="page"
          className="inline-flex flex-col items-center justify-center w-full h-full transition-all duration-200 ease-in-out relative"
        >
          <div className="h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M1.93359 11.3755L11.9998 2.75L22.0659 11.3755" stroke="#000" strokeLinecap="square"></path>
              <path d="M4.09375 21.2511V10.1602H19.9113V21.2511H4.09375Z" fill="black" stroke="#000" strokeLinecap="square"></path>
              <path d="M12 12.7051L12 16.1135" stroke="#FFF" strokeLinecap="square"></path>
              <path d="M12 3L20.0022 10.0021L12 10.0021L4.00023 10.0002L12 3Z" fill="#000"></path>
            </svg>
          </div>
        </a>

        {/* Shop */}
        <a
          href="/shop"
          aria-label="Shop"
          className="inline-flex flex-col items-center justify-center w-full h-full transition-all duration-200 ease-in-out relative"
        >
          <div className="h-6 flex items-center justify-center">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="15.758" cy="9.709" r="5.7" stroke="black" />
              <path d="M19.654 13.915L22.888 17.14" stroke="black" />
              <path d="M0 5.19H6.956" stroke="black" />
              <path d="M0 12H6.956" stroke="black" />
            </svg>
          </div>
        </a>

        {/* NEW */}
        <a
          href="/men-new-arrivals/buy"
          aria-label="New Arrivals"
          className="inline-flex flex-col items-center justify-center w-full h-full transition-all duration-200 ease-in-out relative"
        >
          <div className="h-6 flex items-center justify-center">
            <span className="text-base font-normal leading-none">NEW</span>
          </div>
        </a>

        {/* Cart */}
        <a
          href="/checkout/cart"
          aria-label="Cart"
          className="inline-flex flex-col items-center justify-center w-full h-full transition-all duration-200 ease-in-out relative"
        >
          <div className="h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17 9V7.86C17 5.17 14.76 3 12 3C9.24 3 7 5.17 7 7.86V9" stroke="#000" />
              <path d="M19.97 22L21 7H3L4.03 22H19.97Z" stroke="#000" />
              <path
                d="M10.28 11C9.53 11 8.94 11.33 8.56 11.83C8.18 12.33 8 12.97 8 13.61C8 14.32 8.28 14.99 8.66 15.57C9.05 16.16 9.56 16.68 10.07 17.12C10.57 17.56 11.07 17.92 11.44 18.17L12.07 18.56L12.7 18.17C13.07 17.92 13.57 17.56 14.07 17.12C14.58 16.68 15.09 16.16 15.48 15.57C15.87 14.99 16.15 14.32 16.15 13.61C16.15 12.97 15.97 12.33 15.59 11.83C15.2 11.33 14.62 11 13.86 11C13.1 11 12.54 11.31 12.17 11.61L12 11.88L11.83 11.61C11.46 11.31 10.91 11 10.28 11Z"
                fill="#E16E50"
              />
            </svg>
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {items.length}
              </span>
            )}
          </div>
        </a>

        {/* Account/Wishlist */}
        <a
          href="/wishlist"
          aria-label="Wishlist"
          className="inline-flex flex-col items-center justify-center w-full h-full transition-all duration-200 ease-in-out relative"
        >
          <div className="h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        </a>
      </div>
    </nav>
  );
};

export default Header;