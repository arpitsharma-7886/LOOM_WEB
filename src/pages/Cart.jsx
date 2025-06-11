import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, Shield, Truck, RefreshCw, AlertCircle } from 'lucide-react';
import MainTemplate from '../components/MainTemplate';
import useCart from '../store/useCart';
import useAuth from '../store/useAuth';
import toast, { Toaster } from 'react-hot-toast';
import PageHeader from '../components/PageHeader';

const Cart = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { cartData, removeItem, updateQuantity, fetchCart, loading, error } = useCart();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/checkout/cart' } });
            return;
        }
        fetchCart();
    }, [isAuthenticated, navigate, fetchCart]);

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            const success = await removeItem(itemId);
            if (success) {
                toast.success('Item removed from cart');
            } else {
                toast.error('Failed to remove item');
            }
        } else if (newQuantity > 5) {
            toast.error('You cannot add more than 5 items');
        } else {
            const success = await updateQuantity(itemId, newQuantity);
            if (!success) {
                toast.error('Failed to update quantity');
            }
        }
    };

    const handleRemoveItem = async (itemId) => {
        const success = await removeItem(itemId);
        if (success) {
            toast.success('Item removed from cart');
        } else {
            toast.error('Failed to remove item');
        }
    };

    const handleCheckout = () => {
        if (!cartData?.items || cartData.items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        navigate('/checkout', {
            state: {
                cartData: cartData // Pass the entire cart data
            }
        });
    };

    if (!isAuthenticated) {
        return null;
    }

    if (loading) {
        return (
            <MainTemplate>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </MainTemplate>
        );
    }

    if (error) {
        return (
            <MainTemplate>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-red-600 text-center">
                        <p className="text-lg font-semibold mb-2">Error Loading Cart</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            </MainTemplate>
        );
    }

    // Check if cartData exists and has items
    const hasItems = cartData && cartData.items && cartData.items.length > 0;

    return (
        <MainTemplate>
            <Toaster position="top-center" />
            <PageHeader title="Cart" />
            <div className="min-h-screen bg-[#f1f3f6] py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {!hasItems ? (
                        <div className="text-center py-16 bg-white rounded-sm shadow-sm">
                            <div className="w-24 h-24 mx-auto mb-6 bg-[#f1f3f6] rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-12 h-12 text-[#2874f0]" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your cart is empty</h2>
                            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-[#2874f0] text-white px-8 py-3 rounded-sm hover:bg-[#1a5dc8] transition-colors duration-200"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">

                                {cartData.items.map((item) => (
                                    <div
                                        key={item._id}
                                        className="bg-white rounded-sm p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex gap-6">
                                            {/* Product Image */}
                                            <div className="w-32 h-32 rounded-sm overflow-hidden flex-shrink-0 group">
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productTitle}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <div>
                                                    <div className='flex justify-between items-center'>
                                                        <h3 className="font-semibold text-lg text-gray-900 hover:text-[#2874f0] transition-colors">
                                                            {item.productTitle}
                                                        </h3>
                                                        <p className="font-semibold text-gray-900">Delivery by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        <span>Color:</span> <span>{item.color}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        <span>Size:</span> <span>{item.size}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Seller: <span>Loom Fashion</span>
                                                    </p>
                                                    <div className='flex items-center gap-3'>
                                                        {item.priceSnapshot.basePrice > parseInt(item.priceSnapshot.sellingPrice) && (
                                                            <p className="text-sm text-gray-500 line-through">
                                                                ₹{item.priceSnapshot.basePrice}
                                                            </p>
                                                        )}
                                                        <p className="font-semibold text-gray-900 text-lg">
                                                            ₹{parseInt(item.priceSnapshot.sellingPrice)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex items-center justify-between">
                                                    <div className="flex items-center space-x-3 bg-[#f1f3f6] rounded-sm p-1">
                                                        <button
                                                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                                            className="p-2 hover:bg-white rounded-sm transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                                            className="p-2 hover:bg-white rounded-sm transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveItem(item._id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Details */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-sm p-6 shadow-sm sticky top-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Price Details</h2>

                                    <div className="space-y-4">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Price ({cartData.itemCount} <span>{cartData.itemCount == 1 ? 'item' : 'items'}</span>)</span>
                                            <span>₹{cartData.pricingSummary.baseTotal}</span>
                                        </div>

                                        {parseInt(cartData.pricingSummary.savings) > 0 && (
                                            <div className="flex justify-between">
                                                <span>Discount</span>
                                                <span className='text-green-600'>-₹{parseInt(cartData.pricingSummary.savings)}</span>
                                            </div>
                                        )}

                                        {cartData.pricingSummary.couponDiscount > 0 && (
                                            <div className="flex justify-between">
                                                <span>Coupon Discount</span>
                                                <span className='text-green-600'>-₹{cartData.pricingSummary.couponDiscount}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between text-gray-600">
                                            <span>Delivery Charges</span>
                                            <span className='text-green-600'>{cartData.pricingSummary.deliveryCharge === 0 ? 'FREE' : `₹${cartData.pricingSummary.deliveryCharge}`}</span>
                                        </div>

                                        <div className="border-t border-t-gray-300 pt-4">
                                            <div className="flex justify-between font-semibold text-lg text-gray-900">
                                                <span>Total Amount</span>
                                                <span>₹{parseInt(cartData.pricingSummary.finalAmount)}</span>
                                            </div>
                                        </div>

                                        <div className="border-t border-t-gray-300 pt-2">
                                            <p className='text-green-600'>You will save <span>{parseInt(cartData.pricingSummary.savings)}</span> on this order</p>
                                        </div>

                                        <button
                                            onClick={handleCheckout}
                                            className="w-full mt-6 bg-black text-white py-4 rounded-sm font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 group"
                                        >
                                            Proceed to Checkout
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </button>

                                        <div className="mt-6 space-y-3 text-sm text-gray-500">
                                            <div className="flex items-start gap-2">
                                                <Shield className="w-4 h-4 text-[#2874f0] mt-0.5 flex-shrink-0" />
                                                <p>Safe and Secure Payments. 100% Authentic products.</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <RefreshCw className="w-4 h-4 text-[#2874f0] mt-0.5 flex-shrink-0" />
                                                <p>Easy 7 days returns and exchanges.</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Truck className="w-4 h-4 text-[#2874f0] mt-0.5 flex-shrink-0" />
                                                <p>Free delivery on orders above ₹499</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainTemplate>
    );
};

export default Cart; 