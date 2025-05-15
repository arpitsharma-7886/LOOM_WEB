import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useWishlist from '../store/useWishlist';
import toast from 'react-hot-toast';

const ProductCard = ({product}) => {
    const navigate = useNavigate();
    const { addItem, removeItem, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product._id);

    const handleClick = () => {
        navigate(`/product/${product._id}`);
    };

    const toggleWishlist = (e) => {
        e.stopPropagation();
        if (isWishlisted) {
            removeItem(product._id);
            toast.success('Removed from wishlist');
        } else {
            addItem(product);
            toast.success('Added to wishlist');
        }
    };

    return (
        <div className="bg-white rounded-md shadow-md hover:shadow-lg transition-all relative overflow-hidden min-h-[380px] mb-6">
            {/* Wishlist icon */}
            <div className="absolute top-3 right-3 z-10">
                <Heart 
                    size={20} 
                    className={`cursor-pointer transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-500 hover:text-red-500'}`}
                    onClick={toggleWishlist}
                />
            </div>

            {/* Image section */}
            <div className="w-full h-[330px] overflow-hidden">
                <img
                    src={product?.images[0]?.url}
                    alt={product.title}
                    className="w-full h-full object-cover object-top cursor-pointer"
                    onClick={handleClick}
                />
            </div>

            {/* Product details */}
            <div className="p-3 flex flex-col gap-1">
                <h3 className="text-[15px] text-gray-900 font-medium truncate">
                    {product.title}
                </h3>
                <p className="text-[15px] font-semibold text-gray-900">₹{product.lowestSellingPrice}</p>

                {/* Color dots */}
                <div className="flex items-center gap-1 mt-1 min-h-[16px]">
                    {product.colorPreview?.slice(0, 3).map((color, idx) => (
                        <span
                            key={idx}
                            className="w-3.5 h-3.5 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.toLowerCase() }}
                        />
                    ))}
                    {product.colorPreview?.length > 3 && (
                        <span className="text-xs text-gray-600 ml-1">
                            +{product.colors.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;