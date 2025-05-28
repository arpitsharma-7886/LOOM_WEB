import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainTemplate from '../components/MainTemplate';
import useAuth from '../store/useAuth';
import toast from 'react-hot-toast';

const LoginSignUp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, setRedirectPath, isAuthenticated } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from || '/';
            navigate(from);
        }
    }, [isAuthenticated, navigate, location.state?.from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!phoneNumber || phoneNumber.length !== 10) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        try {
            setLoading(true);
            const from = location.state?.from || '/';
            setRedirectPath(from);
            const success = await login(phoneNumber, false);
            if (success) {
                navigate('/otp', { state: { phoneNumber, from } });
            }
        } catch (error) {
            toast.error(error.message || 'Failed to send OTP');
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
                                LOGIN
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Enter your phone number to continue
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm font-medium">+91</span>
                                    </div>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        className="appearance-none block w-full pl-12 pr-3 py-3.5 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm transition-all duration-200"
                                        placeholder="Enter your phone number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        maxLength={10}
                                    />
                                </div>
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
                                        'Continue'
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-600">
                            By continuing, you agree to our{' '}
                            <a href="/terms" className="font-medium text-black hover:text-gray-900">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="font-medium text-black hover:text-gray-900">
                                Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </MainTemplate>
    );
};

export default LoginSignUp;
