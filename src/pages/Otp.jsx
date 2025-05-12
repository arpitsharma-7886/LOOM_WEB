import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(15);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer === 0) return;
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="bg-white px-4 py-8 min-h-screen">
      <div className="w-full max-w-md mx-auto mt-6">
        {/* Top Bar */}
        <div className="flex items-center mb-6">
          <ArrowLeft className="cursor-pointer" onClick={()=>{navigate('/login')}} />
          <h1 className="text-lg font-semibold mx-auto">
            LOGIN OR SIGNUP
          </h1>
        </div>

        {/* Info */}
        <p className="text-center text-gray-700 mb-6">
          Enter 4-digit OTP sent to <span className="font-medium">+91 8449407886</span>
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-4 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              className="w-16 h-16 text-center border border-black text-xl focus:outline-none"
            />
          ))}
        </div>

        {/* Timer or OTP resend options */}
        {timer > 0 ? (
          <p className="text-center text-black font-medium">
            RESEND IN &nbsp;
            <span className="inline-block w-12">{`00:${timer.toString().padStart(2, '0')}`}</span>
          </p>
        ) : (
          <div className="text-center mt-6">
            <p className="text-black font-medium mb-4">Didn't get OTP?</p>
            <div className="flex justify-center gap-4">
              <button className="px-4 py-2 border border-black text-black font-medium">Get via SMS</button>
              <button className="px-4 py-2 bg-black text-white font-medium">Get via Call</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpVerification;
