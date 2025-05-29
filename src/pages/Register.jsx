import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../store/useAuth';
import useDeviceToken from '../hooks/useDeviceToken';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    deviceType: 'web'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const { deviceToken, loading: tokenLoading, error: tokenError } = useDeviceToken();

  // Get phone number and from page from location state
  const { phoneNumber, from } = location.state || {};

  // Redirect if no phone number
  useEffect(() => {
    if (!phoneNumber) {
      navigate('/login');
    }
  }, [phoneNumber, navigate]);

  // Update phone number in form data when component mounts
  useEffect(() => {
    if (phoneNumber) {
      setFormData(prev => ({ ...prev, phoneNumber }));
    }
  }, [phoneNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // Basic validation
      if (!formData.name || !formData.email || !formData.phoneNumber) {
        setError('Please fill all required fields');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Add device token to form data
      const registrationData = {
        ...formData,
        deviceToken: deviceToken || 'web-push-placeholder'
      };

      const success = await register(registrationData);
      if (success) {
        // Navigate back to the original page or home if no path specified
        const redirectPath = from || '/';
        navigate(redirectPath, { replace: true });
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-8">
      <div className="max-w-md mx-auto mt-6">
        {/* Top Bar */}
        <div className="flex items-center mb-8">
          <ArrowLeft 
            className="cursor-pointer text-gray-600 hover:text-black transition-colors" 
            onClick={() => navigate('/otp', { 
              state: { 
                phoneNumber,
                from 
              }
            })} 
          />
          <h1 className="text-2xl font-bold mx-auto text-gray-800">
            Complete Profile
          </h1>
        </div>

        {/* Info */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Almost there!
          </h2>
          <p className="text-gray-600">
            Please fill in your details to complete registration
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm animate-fade-in shadow-sm">
            {error}
          </div>
        )}

        {tokenError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-600 rounded-xl text-sm">
            Push notifications are disabled. You can still continue with registration.
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border-2 border-gray-200 px-4 py-4 text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm group-hover:border-gray-300"
              disabled={loading || tokenLoading}
              required
            />
          </div>

          <div className="relative group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border-2 border-gray-200 px-4 py-4 text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm group-hover:border-gray-300"
              disabled={loading || tokenLoading}
              required
            />
          </div>

          <div className="relative group">
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full border-2 border-gray-200 px-4 py-4 text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm group-hover:border-gray-300"
              disabled={loading || tokenLoading || !!phoneNumber}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || tokenLoading}
            className="w-full bg-black text-white py-4 text-lg font-semibold rounded-xl hover:bg-gray-900 transition-all transform hover:scale-[1.02] disabled:bg-gray-400 disabled:transform-none shadow-md hover:shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                REGISTERING...
              </div>
            ) : (
              'COMPLETE REGISTRATION'
            )}
          </button>
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
  );
};

export default Register; 