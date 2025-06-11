import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import MainTemplate from '../components/MainTemplate';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { FaLock, FaTruck, FaUndo } from 'react-icons/fa';
import SizeChartModal from '../components/modals/SizeChartModal';
import SimilarProducts from '../components/SimilarProducts';
import useCart from '../store/useCart';
import useAuth from '../store/useAuth';
import ProductImageGallery from '../components/ProductImageGallery';
import PageHeader from '../components/PageHeader';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [productData, setProductData] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSizeObj, setSelectedSizeObj] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const { addItem, addToCart } = useCart();
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const fetchRef = React.useRef(false);
    const [error, setError] = useState(null);

    const fetchProduct = async () => {
        if (fetchRef.current) return;
        fetchRef.current = true;

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3002/product/admin/prod/product_details/${id}`);
            const data = await response.json();
            if (data.success) {
                // Sort sizes for each color
                const sortedData = {
                    ...data.data,
                    colors: data.data.colors.map(color => ({
                        ...color,
                        sizes: color.sizes.sort((a, b) => {
                            const sizeOrder = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6 };
                            return (sizeOrder[a.size] || 0) - (sizeOrder[b.size] || 0);
                        })
                    }))
                };
                setProductData(sortedData);

                const matchedColor = sortedData.colors.find(color =>
                    color.sizes.some(size => size.variantId === sortedData.defaultVariantId)
                );

                if (matchedColor) {
                    setSelectedColor(matchedColor);
                    const matchedSize = matchedColor.sizes.find(size => size.variantId === sortedData.defaultVariantId);
                    if (matchedSize) {
                        setSelectedSizeObj(matchedSize);
                        setMainImage(matchedSize.images?.[0] || '');
                    }
                    setSelectedImage(0);
                }
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Failed to fetch product details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
        return () => {
            fetchRef.current = false;
        };
    }, [id]);

    const handleColorSelect = (color) => {
        // Sort sizes before setting the color
        const sortedColor = {
            ...color,
            sizes: [...color.sizes].sort((a, b) => {
                const sizeOrder = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6 };
                return (sizeOrder[a.size] || 0) - (sizeOrder[b.size] || 0);
            })
        };
        setSelectedColor(sortedColor);
        
        // Find the first available size (prefer 'S' if available)
        const firstSize = sortedColor.sizes.find(size => size.size === 'S') || sortedColor.sizes[0];
        if (firstSize) {
            setSelectedSizeObj(firstSize);
            setMainImage(firstSize.images?.[0] || '');
            setSelectedImage(0);
        }
    };

    const handleSizeSelect = (sizeObj) => {
        setSelectedSizeObj(sizeObj);
        setMainImage(sizeObj.images?.[0] || '');
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/product/${id}` } });
            return;
        }

        if (!selectedSizeObj) {
            toast.error('Please select a size');
            return;
        }

        if (!selectedColor) {
            toast.error('Please select a color');
            return;
        }

        try {
            const success = await addToCart(id, selectedSizeObj.variantId, quantity);
            if (success) {
                toast.success('Added to cart successfully');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to add to cart');
        }
    };

    const handleBuyNow = () => {
        if (!selectedSizeObj) {
            toast.error('Please select a size');
            return;
        }
        addItem(productData, selectedSizeObj.size, selectedColor);
        navigate('/checkout/payment');
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!productData || !selectedColor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Product not found</p>
            </div>
        );
    }

    // Get images from the selected size or use default product images
    const displayImages = selectedSizeObj?.images || productData.images || [];

    return (
        <MainTemplate>
            <Toaster position="top-center" />
            <div className="min-h-screen bg-white">
                <PageHeader 
                    title="Product Details" 
                    className="sticky top-0 z-10"
                />

                <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <ProductImageGallery
                                images={displayImages}
                                title={productData.title}
                                onWishlistToggle={toggleWishlist}
                                isWishlisted={isWishlisted}
                            />

                            {/* Action Buttons - Desktop View */}
                            <div className="hidden md:flex gap-4 mt-6">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition-all transform hover:scale-[1.02] disabled:bg-gray-400 disabled:transform-none shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Add to Cart</span>
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 bg-white text-black py-4 rounded-xl font-semibold border-2 border-black hover:bg-gray-50 transition-all transform hover:scale-[1.02] disabled:bg-gray-100 disabled:transform-none shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                                >
                                    <span>Buy Now</span>
                                </button>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4 md:space-y-6">
                            <div className="flex items-start justify-between">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{productData.title} - {selectedColor?.value}</h1>
                                <button
                                    onClick={handleShare}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex items-center mt-2 space-x-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 md:w-5 md:h-5 ${
                                                i < productData.averageRating
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm md:text-base text-gray-500">({productData.reviewCount} reviews)</span>
                            </div>

                            <div className="flex items-baseline space-x-4">
                                <span className="text-2xl md:text-3xl font-bold text-gray-900">
                                    ₹{parseInt(selectedSizeObj?.price?.sellingPrice) || '—'}
                                </span>

                                {selectedSizeObj?.price?.mrp && (
                                    <span className="text-lg md:text-xl text-gray-500 line-through">
                                        ₹{parseInt(selectedSizeObj?.price?.mrp)}
                                    </span>
                                )}

                                {selectedSizeObj?.price?.discountPercents && (
                                    <span className="text-base md:text-lg text-green-600">
                                        {selectedSizeObj?.price?.discountPercents}% off
                                    </span>
                                )}
                            </div>

                            {/* Color Selection */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                                <div className="flex flex-wrap gap-2">
                                    {productData.colors.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() => handleColorSelect(color)}
                                            className={`rounded-full ${
                                                selectedColor?.value === color.value
                                                    ? 'ring-2 ring-black'
                                                    : 'hover:ring-2 hover:ring-gray-300'
                                            }`}
                                        >
                                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden">
                                                <img
                                                    src={color.image}
                                                    alt={color.value}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                                    <button
                                        onClick={() => setShowSizeChart(true)}
                                        className="text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        Size Guide
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedColor?.sizes
                                        .sort((a, b) => {
                                            const sizeOrder = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6 };
                                            return (sizeOrder[a.size] || 0) - (sizeOrder[b.size] || 0);
                                        })
                                        .map((sizeObj) => (
                                            <button
                                                key={sizeObj._id || sizeObj.size}
                                                onClick={() => handleSizeSelect(sizeObj)}
                                                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-base ${
                                                    selectedSizeObj?.size === sizeObj.size
                                                        ? 'bg-black text-white'
                                                        : 'border border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                {sizeObj.size}
                                            </button>
                                        ))}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm md:text-base text-gray-700">Quantity:</span>
                                    <div className="flex items-center border rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 hover:rounded-lg"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 text-sm md:text-base">{quantity}</span>
                                        <button
                                            onClick={() => {
                                                if (quantity < 5) {
                                                    setQuantity(quantity + 1);
                                                } else {
                                                    toast.error('You cannot buy more than 5 items of this product');
                                                }
                                            }}
                                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 hover:rounded-lg"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Action Buttons */}
                            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 p-4 z-50">
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all transform hover:scale-[1.02] disabled:bg-gray-400 disabled:transform-none shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>Add to Cart</span>
                                    </button>
                                    <button
                                        onClick={handleBuyNow}
                                        className="flex-1 bg-white text-black py-3 rounded-xl font-semibold border-2 border-black hover:bg-gray-50 transition-all transform hover:scale-[1.02] disabled:bg-gray-100 disabled:transform-none shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                                    >
                                        <span>Buy Now</span>
                                    </button>
                                </div>
                            </div>

                            {/* Extra Info */}
                            <div className="divide-y rounded-lg overflow-hidden mt-4 border border-gray-200">
                                {['DETAILS', 'OFFER', 'REVIEWS', 'DELIVERY', 'RETURNS'].map(title => (
                                    <details key={title} className="group p-4">
                                        <summary className="cursor-pointer font-medium text-gray-800 group-open:text-black">
                                            {title}
                                        </summary>
                                        <div
                                            className="text-sm text-gray-600 mt-2"
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    title === 'DETAILS'
                                                        ? productData.description
                                                        : title === 'DELIVERY'
                                                            ? 'Goods are dispatched within 1–2 hours and shipped within 24 hours, except orders placed on Sundays and national holidays, which are processed on the next working day.'
                                                            : title === 'RETURNS'
                                                                ? `
                                                                    <ul class="list-disc pl-4 space-y-1">
                                                                    <li>Hassle-free returns within 7 days under specific product and promotion conditions.</li>
                                                                    <li>Refunds for prepaid orders revert to the original payment method, while COD orders receive a wallet refund.</li>
                                                                    <li>Report defective, incorrect, or damaged items within 24 hours of delivery.</li>
                                                                    <li>Products bought during special promotions like BOGO are not eligible for returns.</li>
                                                                    <li>For excessive returns, reverse shipment fee up to Rs 100 can be charged, which will be deducted from the refund.</li>
                                                                    <li>Non-returnable items include accessories, sunglasses, perfumes, masks, and innerwear due to hygiene concerns.</li>
                                                                    </ul>`
                                                                : `Information about ${title.toLowerCase()} will appear here.`,
                                            }}
                                        />
                                    </details>
                                ))}
                            </div>

                            {/* Additional Info */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Availability</span>
                                            <span className="block text-sm font-medium text-green-600">In Stock</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-6a1 1 0 00-.293-.707l-3-3A1 1 0 0016 3H3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Shipping</span>
                                            <span className="block text-sm font-medium text-gray-900">Free Delivery</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Return Policy</span>
                                            <span className="block text-sm font-medium text-gray-900">7 Days Return</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 mb-20 md:mb-8">
                {/* <SimilarProducts id={id} /> */}
            </div>
            <SizeChartModal isOpen={showSizeChart} onClose={() => setShowSizeChart(false)} />
        </MainTemplate>
    );
};

export default ProductDetails;