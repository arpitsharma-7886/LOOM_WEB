import React from 'react';
import MainTemplate from '../components/MainTemplate';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Package, Truck, MapPin, Clock } from 'lucide-react';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state?.orderDetails || {
    orderId: 'LOOM' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    amount: location.state?.amount || '2,999',
    paymentMethod: location.state?.paymentMethod || 'Cash on Delivery',
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  };

  console.log(orderDetails, 'Order Details');
  

  const trackingSteps = [
    {
      title: 'Order Placed',
      description: 'Your order has been placed successfully',
      icon: Check,
      status: 'completed',
      date: new Date().toLocaleDateString('en-IN')
    },
    {
      title: 'Processing',
      description: 'Your order is being processed',
      icon: Package,
      status: 'current',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')
    },
    {
      title: 'Shipped',
      description: 'Your order has been shipped',
      icon: Truck,
      status: 'pending',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')
    },
    {
      title: 'Delivered',
      description: 'Expected delivery date',
      icon: MapPin,
      status: 'pending',
      date: orderDetails.estimatedDelivery
    }
  ];

  return (
    <MainTemplate>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Success Message */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-semibold mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600">
                Thank you for your purchase. We'll send you a confirmation email shortly.
              </p>
            </div>

            {/* Order Details */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Order ID</p>
                  <p className="font-semibold">{orderDetails.orderId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Payment Method</p>
                  <p className="font-semibold">{orderDetails.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-gray-600">Order Amount</p>
                  <p className="font-semibold">₹{orderDetails.amount}</p>
                </div>
                <div>
                  <p className="text-gray-600">Estimated Delivery</p>
                  <p className="font-semibold">{orderDetails.estimatedDelivery}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Tracking */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Order Tracking</h2>
            <div className="space-y-8">
              {trackingSteps.map((step, index) => (
                <div key={step.title} className="relative">
                  {index !== trackingSteps.length - 1 && (
                    <div
                      className={`absolute left-6 top-10 w-0.5 h-full -ml-px ${
                        step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                  <div className="flex items-start">
                    <div
                      className={`relative flex items-center justify-center w-12 h-12 rounded-full ${
                        step.status === 'completed'
                          ? 'bg-green-500'
                          : step.status === 'current'
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                      }`}
                    >
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                      <p className="text-gray-500 text-sm mt-1">{step.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 font-medium"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default OrderSuccessPage;