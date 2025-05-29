import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainTemplate from '../components/MainTemplate';
import useAuth from '../store/useAuth';
import toast from 'react-hot-toast';

const Otp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyOTP, login, redirectPath, isNewUser } = useAuth();
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const phoneNumber = location.state?.phoneNumber;

    useEffect(() => {
        if (!phoneNumber) {
            navigate('/login');
            return;
        }

        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer, phoneNumber, navigate]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 4) {
            const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 5) {
            toast.error('Please enter a valid 5-digit OTP');
            return;
        }

        try {
            setLoading(true);
            const success = await verifyOTP(phoneNumber, otpString);
            if (success) {
                const { isNewUser } = useAuth.getState();
                if (isNewUser) {
                    navigate('/register', { state: { phoneNumber, from: location.state?.from } });
                } else {
                    const from = location.state?.from || redirectPath || '/';
                    navigate(from);
                }
            }
        } catch (error) {
            toast.error(error.message || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;
        
        try {
            setLoading(true);
            await login(phoneNumber, true);
            setTimer(30);
            setCanResend(false);
            toast.success('OTP resent successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainTemplate>
            <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-md w-full space-y-8">
                    <div className="mt-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <div className="flex justify-center items-center flex-col mb-8">
                            <img src="/loom_2.jpg" alt="LOOM" className="w-32 h-32 rounded-full shadow-lg mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                Verify OTP
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Enter the 5-digit code sent to {phoneNumber}
                            </p>
                        </div>

                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="flex justify-center space-x-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        name={`otp-${index}`}
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-xl focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-50 transition-all duration-200"
                                    />
                                ))}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        'Verify OTP'
                                    )}
                                </button>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={!canResend || loading}
                                    className="text-sm text-gray-600 hover:text-black disabled:opacity-50 transition-colors duration-200 font-medium"
                                >
                                    {canResend ? 'Resend OTP' : `Resend OTP in ${timer}s`}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-600">
                            Didn't receive the code?{' '}
                            <button
                                onClick={handleResendOTP}
                                disabled={!canResend || loading}
                                className="font-medium text-black hover:text-gray-900 disabled:opacity-50"
                            >
                                Try another method
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainTemplate>
    );
};

export default Otp;
