import React from 'react';
import MainTemplate from '../components/MainTemplate';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <MainTemplate>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-semibold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. We'll send you a confirmation email shortly.
          </p>
          
          <button
            onClick={() => navigate('/')}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </MainTemplate>
  );
};

export default OrderSuccessPage;