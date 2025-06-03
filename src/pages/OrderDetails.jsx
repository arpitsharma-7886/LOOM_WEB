import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Package, MapPin, Calendar, Clock, IndianRupee, Truck,
  CheckCircle2, CircleDot, Circle, Check
} from 'lucide-react';
import axios from 'axios';
import MainTemplate from '../components/MainTemplate';
import { toast } from 'react-hot-toast';

const OrderStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

const SummaryItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 sm:gap-3">
    <div className="mt-0.5 text-gray-400">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm sm:text-base font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

const OrderStatusStepper = ({ currentStatus }) => {
  const steps = [
    { status: 'Ordered', description: 'Your order has been placed' },
    { status: 'Confirmed', description: 'Order has been confirmed' },
    { status: 'Shipped', description: 'Your order is on the way' },
    { status: 'Delivered', description: 'Order has been delivered' }
  ];
  const currentStep = steps.findIndex(step => step.status.toLowerCase() === currentStatus?.toLowerCase());
  const activeStep = currentStep === -1 ? 0 : currentStep;

  return (
    <div className="w-full py-4 sm:py-8">
      {/* Mobile View (Vertical) */}
      <div className="flex flex-col gap-8 sm:hidden">
        {steps.map((step, index) => (
          <div key={step.status} className="flex items-start gap-4 relative">
            {/* Vertical Line */}
            {index < steps.length - 1 && (
              <div className="absolute top-10 left-4 w-[2px] h-[calc(100%+2rem)] -z-0 bg-gray-200">
                <div 
                  className="h-full bg-black transition-all duration-500"
                  style={{ height: index < activeStep ? '100%' : '0%' }}
                />
              </div>
            )}
            
            {/* Step Circle */}
            <div className="z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2
                ${index <= activeStep 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-400 border-gray-300'}`}>
                {index < activeStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <p className={`font-medium ${index <= activeStep ? 'text-black' : 'text-gray-400'}`}>
                {step.status}
              </p>
              <p className="text-xs text-gray-500 mt-1">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View (Horizontal) */}
      <div className="hidden sm:flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div key={step.status} className="flex flex-col items-center flex-1 relative">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10
                ${index <= activeStep 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-400 border-gray-300'}`}>
                {index < activeStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <p className={`mt-2 text-sm font-medium ${index <= activeStep ? 'text-black' : 'text-gray-400'}`}>
                {step.status}
              </p>
              <p className="text-xs text-gray-500 mt-1 text-center w-24">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 w-full h-[2px] bg-gray-200">
                <div 
                  className="h-full bg-black transition-all duration-500"
                  style={{ width: index < activeStep ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const PriceBreakdown = ({ priceSnapshot }) => (
  <div className="space-y-3 text-sm">
    <div className="flex justify-between">
      <span className="text-gray-600">Price ({priceSnapshot?.quantity} item)</span>
      <span>₹{priceSnapshot?.mrp}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600">Discount</span>
      <span className="text-black">- ₹{priceSnapshot?.discountAmount.toFixed(2)}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600">Delivery Charges</span>
      <span className="text-black">FREE</span>
    </div>
    <div className="flex justify-between pt-3 border-t font-medium text-base">
      <span>Total Amount</span>
      <span>₹{priceSnapshot?.totalAmount.toFixed(2)}</span>
    </div>
  </div>
);

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`http://192.168.29.92:3006/order/check/order_item_details/${orderId}`, {
        headers: {
          accesstoken: `${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch order details');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainTemplate>
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      </MainTemplate>
    );
  }

  if (!order) {
    return (
      <MainTemplate>
        <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
          <p className="text-red-500 text-lg">Order not found.</p>
          <button onClick={() => navigate('/orders')} className="mt-4 text-black hover:underline">
            Back to Orders
          </button>
        </div>
      </MainTemplate>
    );
  }

  const {
    orderNumber,
    orderDate,
    paymentMethod,
    orderStatus,
    shippingAddress,
    productImage,
    productTitle,
    size,
    color,
    quantity,
    priceSnapshot,
  } = order;

  return (
    <MainTemplate>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-black text-white py-3 sm:py-4 px-4">
          <div className="max-w-6xl mx-auto flex items-center gap-3 sm:gap-4">
            <button onClick={() => navigate('/orders')} className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-full cursor-pointer">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-xl font-medium">Order #{orderNumber}</h1>
              <p className="text-xs sm:text-sm opacity-90">Placed on {new Date(orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-4 sm:py-6 px-4 space-y-4 sm:space-y-6">
          {/* Order Status Timeline */}
          <div className="bg-white rounded shadow p-4 sm:p-6">
            <OrderStatusStepper currentStatus={orderStatus} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Product Details */}
              <div className="bg-white rounded shadow">
                <div className="p-4 sm:p-6 border-b">
                  <h2 className="text-base sm:text-lg font-medium">Item Details</h2>
                </div>
                <div className="p-4 sm:p-6 flex gap-4 sm:gap-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                    <img src={productImage} alt={productTitle} className="w-full h-full object-cover rounded" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2">{productTitle}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Size: {size} | Color: {color}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Quantity: {quantity}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm sm:text-base">₹{priceSnapshot?.sellingPrice.toFixed(2)}</span>
                      <span className="line-through text-gray-400 text-xs sm:text-sm">₹{priceSnapshot?.mrp}</span>
                      <span className="text-black text-xs sm:text-sm">{Math.round((priceSnapshot?.mrp - priceSnapshot?.sellingPrice) / priceSnapshot?.mrp * 100)}% off</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded shadow p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-medium mb-4">Delivery Address</h2>
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-medium">{shippingAddress.name}</p>
                    <p className="text-gray-600 mt-1">{shippingAddress.houseNumber}, {shippingAddress.area}</p>
                    <p className="text-gray-600">{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pinCode}</p>
                    <p className="text-gray-600">{shippingAddress.country}</p>
                    <p className="mt-2">Phone: {shippingAddress.mobile}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Details Card */}
            <div className="bg-white rounded shadow p-4 sm:p-6 h-fit">
              <h2 className="text-base sm:text-lg font-medium mb-4">Price Details</h2>
              <PriceBreakdown priceSnapshot={priceSnapshot} />
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center gap-2 text-black text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <p>Your total savings on this order ₹{priceSnapshot?.discountAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default OrderDetails;
