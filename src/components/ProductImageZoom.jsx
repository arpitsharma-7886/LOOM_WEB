import React, { useState, useRef, useEffect } from 'react';

const ProductImageZoom = ({ images, selectedImageIndex }) => {
    const [isZooming, setIsZooming] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    const zoomLevel = 2.5; // Magnification level

    const handleMouseEnter = () => {
        setIsZooming(true);
    };

    const handleMouseLeave = () => {
        setIsZooming(false);
    };

    const handleMouseMove = (e) => {
        if (!imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const boundedX = Math.max(0, Math.min(100, x));
        const boundedY = Math.max(0, Math.min(100, y));

        setZoomPosition({ x: boundedX, y: boundedY });
    };

    useEffect(() => {
        setIsZooming(false);
    }, [selectedImageIndex]);

    const currentImage = images[selectedImageIndex];

    return (
        <div className="relative w-full">
            <div
                className="relative overflow-hidden rounded-lg cursor-zoom-in"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                <img
                    ref={imageRef}
                    src={currentImage}
                    alt="Product"
                    className="w-full h-auto object-contain rounded-lg"
                />
            </div>

            {isZooming && (
                <div
                    className="absolute top-0 right-[-320px] w-[300px] h-[300px] border border-gray-200 shadow-lg rounded-lg overflow-hidden bg-white z-10 hidden md:block"
                    style={{
                        backgroundImage: `url(${currentImage})`,
                        backgroundSize: `${100 * zoomLevel}% ${100 * zoomLevel}%`,
                        backgroundPosition: `${-zoomPosition.x * zoomLevel + 50}% ${-zoomPosition.y * zoomLevel + 50}%`,
                        opacity: isZooming ? 1 : 0,
                        transition: 'opacity 0.2s ease-in-out'
                    }}
                />
            )}
        </div>
    );
};

export default ProductImageZoom;


{/* <div className="flex-1 relative">
<ProductImageZoom
    images={productData.images.length > 0 ? productData.images : [productData.preview_image]}
    selectedImageIndex={mainImage}
/>
<button
    onClick={toggleWishlist}
    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:text-red-500 transition cursor-pointer"
>
    <Heart size={20} fill={isWishlisted ? 'red' : 'none'} color={isWishlisted ? 'red' : 'black'} />
</button>
</div> */}
