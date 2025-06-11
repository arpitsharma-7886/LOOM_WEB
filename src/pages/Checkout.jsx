import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuth from '../store/useAuth';
import useCart from '../store/useCart';
import AddressManager from '../components/AddressManager';
import AddressForm from '../components/AddressForm';
// import CustomPaymentModal from '../components/CustomPaymentModal';
import PaymentPage from './PaymentPage';
import axios from 'axios';
import PageHeader from '../components/PageHeader';



const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const { cartData, loading: cartLoading } = useCart();

  console.log(addresses, "addresses");
  

  // Fetch addresses from API
  const fetchAddresses = async () => {
    try {
      const response = await axios.get('http://192.168.29.92:3001/auth_user/address/addresses', {
        headers: {
          'accesstoken': `${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        const allAddresses = [];
        
        // Add default address if exists
        if (response.data.data.defaultAddress) {
          const defaultAddr = response.data.data.defaultAddress;
          allAddresses.push({
            id: defaultAddr._id,
            fullName: defaultAddr.name,
            phone: defaultAddr.mobile,
            street: `${defaultAddr.houseNumber}, ${defaultAddr.area}`,
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pinCode,
            country: defaultAddr.country,
            type: defaultAddr.isDefault ? 'Home' : 'Other'
          });
        }

        // Add other addresses if exist
        if (response.data.data.otherAddresses && response.data.data.otherAddresses.length > 0) {
          const otherAddresses = response.data.data.otherAddresses.map(addr => ({
            id: addr._id,
            fullName: addr.name,
            phone: addr.mobile,
            street: `${addr.houseNumber}, ${addr.area}`,
            city: addr.city,
            state: addr.state,
            pincode: addr.pinCode,
            country: addr.country,
            type: addr.isDefault ? 'Home' : 'Other'
          }));
          allAddresses.push(...otherAddresses);
        }

        setAddresses(allAddresses);
        
        // Set default address as selected if exists
        if (response.data.data.defaultAddress) {
          const defaultAddr = response.data.data.defaultAddress;
          setSelectedAddress({
            id: defaultAddr._id,
            fullName: defaultAddr.name,
            phone: defaultAddr.mobile,
            street: `${defaultAddr.houseNumber}, ${defaultAddr.area}`,
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pinCode,
            country: defaultAddr.country,
            type: 'Home'
          });
        } else if (allAddresses.length > 0) {
          setSelectedAddress(allAddresses[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated]);

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(
        `http://192.168.29.92:3001/auth_user/address/delete/${addressId}`,
        {
          headers: {
            'accesstoken': `${localStorage.getItem('token')}`
          }
        }
      );
      toast.success('Address deleted successfully');
      fetchAddresses(); // Refresh the address list
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleAddressSubmit = async (addressData) => {
    try {
      const apiData = {
        name: addressData.fullName,
        mobile: addressData.phone,
        pinCode: addressData.pincode,
        houseNumber: addressData.street.split(',')[0]?.trim() || '',
        area: addressData.street.split(',').slice(1).join(',').trim() || addressData.street,
        city: addressData.city,
        state: addressData.state,
        country: 'India',
        isDefault: addressData.type === 'Home'
      };

      if (editingAddress) {
        // Update existing address
        await axios.patch(
          `http://192.168.29.92:3001/auth_user/address/update/${editingAddress.id}`,
          apiData,
          {
            headers: {
              'accesstoken': `${localStorage.getItem('token')}`
            }
          }
        );
        toast.success('Address updated successfully');
      } else {
        // Create new address
        await axios.post(
          'http://192.168.29.92:3001/auth_user/address/create',
          apiData,
          {
            headers: {
              'accesstoken': `${localStorage.getItem('token')}`
            }
          }
        );
        toast.success('Address added successfully');
      }
      
      setShowAddressForm(false);
      fetchAddresses(); // Refresh the address list
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    try {
      setLoading(true);
      
      // Create checkout order
      const checkoutResponse = await axios.post('https://order-api.compactindiasolutions.com/order/check/checkout', {
        addressId: selectedAddress.id,
        couponCode: "", // Add coupon handling if needed
        couponDiscount: 0,
        walletPointsToUse: 0
      }, {
        headers: {
          'accesstoken': `${localStorage.getItem('token')}`
        }
      });

      console.log(checkoutResponse,'checkoutResponse');
      
      if (!checkoutResponse.data?.success) {
        throw new Error(checkoutResponse.data?.message || 'Checkout failed');
      }

      const orderId = checkoutResponse.data?.data?.orderId;
      if (!orderId) {
        throw new Error('Order ID not received from checkout');
      }

      // Navigate to payment page with order details
      navigate('/payment', {
        state: {
          selectedAddress,
          orderTotal: cartData?.pricingSummary?.finalAmount || 0,
          itemCount: cartData?.itemCount || 0,
          cartData,
          orderId // Pass the orderId to payment page
        }
      });

    } catch (error) {
      console.error('Checkout Error:', error.message);
      toast.error(error.message || 'Failed to process checkout');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader title="Checkout" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address and Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Address Section */}
            <AddressManager
              addresses={addresses}
              selectedAddress={selectedAddress}
              onAddressSelect={setSelectedAddress}
              onAddNewClick={handleAddNewAddress}
              onEditAddress={handleEditAddress}
              onDeleteAddress={handleDeleteAddress}
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{cartData?.pricingSummary?.finalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹300</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{cartData?.pricingSummary?.finalAmount}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || !selectedAddress}
                className={`w-full py-4 rounded-xl font-semibold mt-6 flex items-center justify-center space-x-2 ${
                  loading || !selectedAddress
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-900'
                } transition-colors`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Place Order</span>
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500 mt-4 text-center">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>

              {/* <PaymentPage
                isOpen={showCustomModal}
                onClose={() => setShowCustomModal(false)}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                customPaymentDetails={customPaymentDetails}
                handleCustomPaymentInput={handleCustomPaymentInput}
                handleCustomPayment={handleCustomPayment}
                loading={loading}
              /> */}
            </div>
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <AddressForm
          address={editingAddress}
          onSubmit={handleAddressSubmit}
          onClose={() => setShowAddressForm(false)}
        />
      )}
    </div>
  );
};

export default Checkout;