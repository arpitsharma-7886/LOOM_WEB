import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = () => {
    console.log('Sending OTP to:', phone);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4">
      <div className="w-full max-w-md bg-white p-6">
        {/* Top bar */}
        <div className="flex items-center mb-6 relative">
          <ArrowLeft
            className="absolute left-0 top-1 cursor-pointer"
            onClick={() => navigate('/')}
          />
          <h1 className="text-lg font-semibold mx-auto text-center">
            LOGIN OR SIGNUP
            <span className="block w-16 h-[2px] bg-black mt-2 mx-auto rounded" />
          </h1>
        </div>

        {/* Subheading */}
        <p className="text-center text-gray-600 text-sm mb-6">
          Unlock coupons, profile and much more
        </p>

        {/* Phone input */}
        <div className="mb-4">
          <input
            type="tel"
            placeholder="+91 |"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 text-lg rounded-md focus:outline-none focus:border-black"
          />
        </div>

        {/* Send OTP button */}
        <button
          onClick={handleSendOtp}
          className="w-full bg-black text-white py-3 text-lg font-semibold rounded-md hover:bg-gray-900 transition"
        >
          SEND OTP
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
