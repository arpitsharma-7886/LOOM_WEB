import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PageHeader = ({ title, subtitle, showBackButton = true, className = '' }) => {
  const navigate = useNavigate();

  return (
    <div className={`bg-white md:bg-black text-black md:text-white py-3 sm:py-4 px-4 ${className}`}>
      <div className="max-w-6xl mx-auto flex items-center gap-3 sm:gap-4">
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)} 
            className="p-1.5 sm:p-2 hover:bg-gray-100 md:hover:bg-gray-800 rounded-full cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-base sm:text-xl font-medium">{title}</h1>
          {subtitle && (
            <p className="text-xs sm:text-sm opacity-90">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader; 