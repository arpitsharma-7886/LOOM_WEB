import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, Star } from 'lucide-react';
import MainTemplate from '../components/MainTemplate';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { FaLock, FaTruck, FaUndo } from 'react-icons/fa';
import SizeChartModal from '../components/modals/SizeChartModal';
import SimilarProducts from '../components/SimilarProducts';
import useCart from '../store/useCart';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productData, setProductData] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const { addItem } = useCart();

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://192.168.29.81:3002/product/admin/prod/product_details/${id}`);
            const data = response.data;

            if (data?.success) {
                setProductData(data.data);

                const matchedColor = data.data.colors.find(color =>
                    color.sizes.some(size => size.variantId === data.data.defaultVariantId)
                );

                if (matchedColor) {
                    setSelectedColor(matchedColor);
                    const matchedSize = matchedColor.sizes.find(size => size.variantId === data.data.defaultVariantId);
                    setSelectedSize(matchedSize?.size);
                    setMainImage(matchedSize?.images?.[0]);
                }
            }
        } catch (error) {
            console.error('API error:', error);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const handleColorSelect = (variant) => {
        setSelectedColor(variant);
        const firstSize = variant.sizes?.[0];
        if (firstSize) {
            setSelectedSize(firstSize.size);
            setMainImage(firstSize.images?.[0]);
        }
    };

    const handleSizeSelect = (sizeObj) => {
        setSelectedSize(sizeObj.size);
        setMainImage(sizeObj.images?.[0]);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }
        addItem(productData, selectedSize, selectedColor);
        toast.success('Added to cart successfully!');
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }
        addItem(productData, selectedSize, selectedColor);
        navigate('/checkout');
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    if (!productData || !selectedColor) {
        return <div className="text-center py-20 text-lg">Loading...</div>;
    }

    const selectedSizeObj = selectedColor.sizes.find(size => size.size === selectedSize);

    return (
        <MainTemplate>
            <Toaster position="top-center" />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Image Gallery */}
                    <div className="md:w-2/5">
                        <div className="flex gap-4 relative">
                            {/* Thumbnails */}
                            <div className="flex flex-col gap-3">
                                {selectedSizeObj?.images?.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Thumb ${index}`}
                                        onClick={() => setMainImage(img)}
                                        className={`w-16 h-16 object-cover rounded-md border cursor-pointer ${mainImage === img ? 'border-black' : 'border-gray-300'}`}
                                    />
                                ))}
                            </div>
                            {/* Main Image */}
                            <div className="flex-1 relative">
                                <img
                                    src={mainImage}
                                    alt="Main Product"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                    onClick={toggleWishlist}
                                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:text-red-500 transition cursor-pointer"
                                >
                                    <Heart size={20} fill={isWishlisted ? 'red' : 'none'} color={isWishlisted ? 'red' : 'black'} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-[#6b7280] text-white py-4 rounded-lg font-medium hover:bg-[#eeebeb] hover:text-black transition cursor-pointer"
                            >
                                ADD TO CART
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 bg-[#000] text-white py-4 rounded-lg font-medium hover:bg-[#eeebeb] hover:text-black transition cursor-pointer"
                            >
                                BUY NOW
                            </button>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="md:w-3/5">
                        <div className="border-b pb-4">
                            <div className="flex justify-between items-start">
                                <h1 className="text-xl font-medium text-gray-900">{productData.title}</h1>
                                <button onClick={handleShare} className="flex items-center gap-1 text-gray-600 hover:text-black transition">
                                    <Share2 size={18} />
                                    <span className="text-sm">SHARE</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded">
                                    <span>{productData.averageRating}</span>
                                    <Star size={14} fill="white" />
                                </div>
                                <span className="text-gray-500">{productData.reviewCount} reviews</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="py-4 border-b">
                            <div className="flex items-center gap-2">
                                {/* Selling Price */}
                                <span className="text-2xl font-bold text-black">
                                    ₹{selectedSizeObj?.price?.sellingPrice || '—'}
                                </span>

                                {/* MRP with strikethrough */}
                                <span className="text-base font-medium text-gray-500 line-through">
                                    ₹{selectedSizeObj?.price?.mrp || '—'}
                                </span>

                                {/* Discount */}
                                <span className="text-base font-medium text-green-600">
                                    {selectedSizeObj?.price?.discountPercents ? `${selectedSizeObj?.price?.discountPercents}% off` : '—'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">inclusive of all taxes</p>
                        </div>


                        {/* Colors */}
                        <div className="py-4 border-b">
                            <h2 className="font-medium mb-3">SELECT COLOR</h2>
                            <div className="flex gap-3">
                                {productData.colors.map((variant, i) => (
                                    <img
                                        key={i}
                                        src={variant.image}
                                        alt={`Color ${i}`}
                                        onClick={() => handleColorSelect(variant)}
                                        className={`w-[65px] h-[100px] rounded-md border cursor-pointer ${selectedColor === variant ? 'border-black' : 'border-gray-300'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="py-4 border-b">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="font-medium">SELECT SIZE</h2>
                                <button className="text-blue-600 text-sm cursor-pointer" onClick={() => setShowSizeChart(true)}>Size Chart</button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {selectedColor.sizes.map(sizeObj => (
                                    <button
                                        key={sizeObj.size}
                                        onClick={() => handleSizeSelect(sizeObj)}
                                        className={`w-10 h-10 rounded-full border ${selectedSize === sizeObj.size ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'}`}
                                    >
                                        {sizeObj.size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Extra Info */}
                        <div className="divide-y border rounded-lg overflow-hidden mt-4">
                            {['DETAILS', 'OFFER', 'REVIEWS', 'DELIVERY', 'RETURNS'].map(title => (
                                <details key={title} className="group p-4">
                                    <summary className="cursor-pointer font-medium text-gray-800 group-open:text-black">
                                        {title}
                                    </summary>
                                    <p
                                        className="text-sm text-gray-600 mt-2"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                title === 'DETAILS'
                                                    ? productData.description
                                                    : `Information about ${title.toLowerCase()} will appear here.`,
                                        }}
                                    />
                                </details>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 text-center text-sm text-gray-600 pt-6">
                            <div className="flex flex-col items-center gap-1">
                                <FaTruck className="text-xl" />
                                Free Shipping
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <FaUndo className="text-xl" />
                                7-Day Return
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <FaLock className="text-xl" />
                                Secure Payment
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SimilarProducts id={id} />
            <SizeChartModal isOpen={showSizeChart} onClose={() => setShowSizeChart(false)} />
        </MainTemplate>
    );
};

export default ProductDetails;