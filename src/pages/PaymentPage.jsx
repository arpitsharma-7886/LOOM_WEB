import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Banknote, Shield, X, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Session timeout modal component
const SessionTimeoutModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Session Expired</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Your session has expired. Please return to checkout and try again.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          OK
        </button>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [showSessionTimeout, setShowSessionTimeout] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds = 1 minute
  const { selectedAddress, orderTotal, couponCode, couponDiscount, walletPointsToUse } = location.state || {};

  // Session timeout effect with countdown
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          setShowSessionTimeout(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleSessionTimeout = () => {
    setShowSessionTimeout(false);
    navigate('/checkout');
  };

  // Format time left into MM:SS
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePayment = async (paymentMethod) => {
    if (showSessionTimeout) {
      return;
    }

    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderId = location.state?.orderId;
      if (!orderId) {
        throw new Error('Order ID not found. Please try again.');
      }

      // Process payment
      const paymentResponse = await axios.post('http://192.168.29.92:3006/order/check/payment', {
        orderId: orderId,
        paymentMethod: paymentMethod.toUpperCase()
      }, {
        headers: {
          'accesstoken': `${localStorage.getItem('token')}`
        }
      });

      // // Check if payment was successful
      // if (!paymentResponse.data?.success) {
      //   throw new Error(paymentResponse.data?.message || 'Payment failed');
      // }

      // Show success and navigate
      toast.success(paymentResponse.data?.message || 'Order placed successfully!');
      navigate('/order-success', {
        state: {
          orderDetails: {
            orderId: orderId,
            amount: orderTotal || 0,
            paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase(),
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          }
        }
      });

    } catch (error) {
      console.error('Payment Error:', error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to process payment';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: 'cod',
      title: 'Cash on Delivery',
      description: 'Pay when you receive',
      icon: Banknote,
      form: (
        <div className="mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Note:</span> Please keep exact change ready at the time of delivery.
              Our delivery partner will verify the order before handing it over.
            </p>
          </div>
          <button
            onClick={() => handlePayment('cod')}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 mt-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      )
    },
    // Add more payment methods here as needed
  ];

  if (!selectedAddress) {
    navigate('/checkout');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showSessionTimeout && <SessionTimeoutModal onClose={handleSessionTimeout} />}
      
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/checkout')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-semibold ml-4">Payment Options</h1>
            </div>
            {/* Session Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              timeLeft <= 10 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                Session expires in: {formatTimeLeft()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-6 border-b last:border-b-0 cursor-pointer transition-colors ${
                    selectedMethod === method.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-start">
                    <input
                      type="radio"
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="mt-1"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <method.icon className="w-5 h-5" />
                        <span className="font-medium">{method.title}</span>
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                      {selectedMethod === method.id && method.form}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              {/* Price Details */}
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Price ({location.state?.itemCount || 1} items)</span>
                  <span>₹{orderTotal || 0}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Coupon Discount</span>
                    <span className="text-green-600">-₹{couponDiscount}</span>
                  </div>
                )}
                {walletPointsToUse > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Wallet Points Used</span>
                    <span className="text-green-600">-₹{walletPointsToUse}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">FREE</span>
                </div>
                {selectedMethod === 'cod' && (
                  <div className="flex justify-between text-gray-600">
                    <span>COD Charges</span>
                    <span>₹100</span>
                  </div>
                )}
                <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>₹{(orderTotal || 0) - (couponDiscount || 0) - (walletPointsToUse || 0) + (selectedMethod === 'cod' ? 100 : 0)}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Deliver to:</h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{selectedAddress.fullName}</p>
                  <p>{selectedAddress.street}</p>
                  <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}</p>
                  <p>Phone: {selectedAddress.phone}</p>
                </div>
              </div>

              {/* Secure Payment Message */}
              <div className="flex items-center gap-2 mt-6 pt-6 border-t text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
