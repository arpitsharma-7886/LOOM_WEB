import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainTemplate from '../components/MainTemplate';
import PageHeader from '../components/PageHeader';
import useAuth from '../store/useAuth';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://order-api.compactindiasolutions.com/order/check/order_item', {
        headers: {
          'accesstoken': `${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <PageHeader title="Orders" />

      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
          <h1 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800">My Orders</h1>

          {loading ? (
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-center">Loading orders...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {orders.map((order) => (
                <div key={order.id || order._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-3 sm:p-4">
                    {/* Mobile View */}
                    <div className="block md:hidden">
                      <div className="flex justify-between">
                        <div className="flex space-x-3 flex-1">
                          <img
                            src={order?.productImage}
                            alt={order?.productTitle}
                            className="w-20 h-24 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h2 className="text-sm font-medium text-gray-900 line-clamp-2">{order?.productTitle}</h2>
                            <p className="mt-1 text-xs text-gray-500">
                              Color: <span className="font-medium">{order?.color || 'N/A'}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Size: <span className="font-medium">{order?.size || 'N/A'}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: <span className="font-medium">{order?.quantity}</span>
                            </p>
                            <p className="text-sm font-medium text-gray-900 mt-1">₹{parseInt(order?.priceSnapshot?.sellingPrice)}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between ml-4">
                          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap
                            ${order.itemStatus === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'}`}>
                            {order.itemStatus || 'Placed'}
                          </div>
                          <button 
                            className="text-xs sm:text-sm bg-black text-white px-3 py-1.5 rounded-md cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap" 
                            onClick={() => navigate(`/order/${order.itemId}`)}>
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 flex space-x-4">
                        <img
                          src={order?.productImage}
                          alt={order?.productTitle}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex flex-col justify-center">
                          <h2 className="text-sm font-medium text-gray-900 line-clamp-2">{order?.productTitle}</h2>
                          <p className="mt-1 text-xs text-gray-500">
                            Color: <span className="font-medium">{order?.color || 'N/A'}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Size: <span className="font-medium">{order?.size || 'N/A'}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: <span className="font-medium">{order?.quantity}</span>
                          </p>
                        </div>
                      </div>

                      <div className="col-span-2 text-center">
                        <p className="text-sm font-medium text-gray-900">₹{parseInt(order?.priceSnapshot?.sellingPrice)}</p>
                      </div>

                      <div className="col-span-3 flex justify-center">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${order.itemStatus === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'}`}>
                          {order.itemStatus || 'Placed'}
                        </div>
                      </div>

                      <div className="col-span-2 text-right">
                        <button 
                          className="text-sm bg-black text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-800 transition-colors" 
                          onClick={() => navigate(`/order/${order.itemId}`)}>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {order.status === 'Cancelled' && (
                    <div className="bg-gray-50 px-3 sm:px-4 py-2 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-600">
                        <svg className="h-4 w-4 text-red-400 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="line-clamp-2">
                          Cancelled Today, {new Date(order.cancelDate).toLocaleDateString()} -
                          {order.cancelReason || 'You requested a cancellation because you wanted it in another size/colour.'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-center">No orders found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
