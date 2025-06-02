import React, { useState, useRef } from 'react';
import { Heart } from 'lucide-react';

const ProductImageGallery = ({ images, title, onWishlistToggle, isWishlisted }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [showZoom, setShowZoom] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!imageRef.current) return;
        
        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePosition({ x, y });
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                {/* Thumbnail Images */}
                {images.length > 0 && (
                    <div className="flex flex-col gap-4">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`aspect-square w-20 rounded-xl overflow-hidden transition-all ${
                                    selectedImage === index
                                        ? 'ring-2 ring-black scale-105'
                                        : 'hover:ring-2 hover:ring-gray-300'
                                }`}
                            >
                                <img
                                    src={image}
                                    alt={`${title} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* Main Image */}
                <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-100">
                    {images[selectedImage] ? (
                        <div 
                            ref={imageRef}
                            className="relative w-full h-full"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setShowZoom(true)}
                            onMouseLeave={() => setShowZoom(false)}
                        >
                            <img
                                src={images[selectedImage]}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image available
                        </div>
                    )}
                    {/* Wishlist Button */}
                    <button
                        onClick={onWishlistToggle}
                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                        <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Fixed Zoom Modal */}
            {showZoom && (
                <div 
                    className="fixed top-20 right-20 w-[600px] h-[600px] rounded-lg overflow-hidden shadow-2xl border border-gray-200 bg-white pointer-events-none z-50 m-4"
                    style={{
                        backgroundImage: `url(${images[selectedImage]})`,
                        backgroundSize: '200%',
                        backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                    }}
                />
            )}
        </div>
    );
};

export default ProductImageGallery; 