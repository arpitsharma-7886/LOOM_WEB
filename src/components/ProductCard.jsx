import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useWishlist from '../store/useWishlist';
import toast from 'react-hot-toast';

const ProductCard = ({product}) => {
    const navigate = useNavigate();
    const { addItem, removeItem, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product._id);

    console.log("produtct",product)

    const handleClick = () => {
        navigate(`/product/${product._id}`);
    };

    const colorMap = {
        "aliceblue": "#F0F8FF",
        "antiquewhite": "#FAEBD7",
        "azureblue": "#F0FFFF",
        "bisqueorange": "#FFE4C4",
        "blanchedalmond": "#FFEBCD",
        "cornflowerblue": "#6495ED",
        "crimsonred": "#DC143C",
        "darkgoldenrod": "#B8860B",
        "darkgray": "#A9A9A9",
        "darkgreen": "#006400",
        "darkmagenta": "#8B008B",
        "darkorange": "#FF8C00",
        "darkorchid": "#9932CC",
        "darksalmon": "#E9967A",
        "darkslate": "#483D8B",
        "deeppink": "#FF1493",
        "deepskyblue": "#00BFFF",
        "dimgray": "#696969",
        "dodgerblue": "#1E90FF",
        "firebrick": "#B22222",
        "floralwhite": "#FFFAF0",
        "forestgreen": "#228B22",
        "ghostwhite": "#F8F8FF",
        "goldenrod": "#DAA520",
        "honeydew": "#F0FFF0",
        "hotpink": "#FF69B4",
        "indianred": "#CD5C5C",
        "ivorywhite": "#FFFFF0",
        "lavenderblush": "#FFF0F5",
        "lemonchiffon": "#FFFACD",
        "lightblue": "#ADD8E6",
        "lightcoral": "#F08080",
        "lightgoldenrod": "#FAFAD2",
        "lightgray": "#D3D3D3",
        "lightgreen": "#90EE90",
        "lightsalmon": "#FFA07A",
        "lightslate": "#8470FF",
        "limegreen": "#32CD32",
        "maroon": "#800000",
        "marron": "#800000",
        "mediumorchid": "#BA55D3",
        "mediumslate": "#7B68EE",
        "mediumviolet": "#C71585",
        "midnightblue": "#191970",
        "mintcream": "#F5FFFA",
        "mistyrose": "#FFE4E1",
        "navyblue": "#000080",
        "oldlace": "#FDF5E6",
        "olivegreen": "#808000",
        "palegreen": "#98FB98",
        "paleviolet": "#DB7093",
        "papayawhip": "#FFEFD5",
        "peachpuff": "#FFDAB9",
        "plumpurple": "#DDA0DD",
        "powderblue": "#B0E0E6",
        "rosybrown": "#BC8F8F",
        "royalblue": "#4169E1",
        "sandybrown": "#F4A460",
        "seagreen": "#2E8B57",
        "skyblue": "#87CEEB",
        "slateblue": "#6A5ACD",
        "slategray": "#708090",
        "springgreen": "#00FF7F",
        "steelblue": "#4682B4",
        "thistlepurple": "#D8BFD8",
        "tomatored": "#FF6347",
        "whitesmoke": "#F5F5F5"
      };

    // Function to check if color is valid in CSS
    const isValidCssColor = (color) => {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
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
            <div className="absolute top-1 right-1 z-10">
                <button
                    onClick={toggleWishlist}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                    <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                {/* <Heart 
                    size={20} 
                    className={`cursor-pointer transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-500 hover:text-red-500'}`}
                    onClick={toggleWishlist}
                /> */}
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
                    {product.colorPreview?.slice(0, 3).map((colorName, idx) => {
                        const formattedName = colorName.replace(/\s+/g, '').toLowerCase();
                        const useColor = isValidCssColor(colorName) 
                        ? colorName 
                        : (colorMap[formattedName] || 'transparent');

                        return (
                        <span
                            key={idx}
                            className="w-3.5 h-3.5 rounded-full border border-gray-300"
                            style={{ backgroundColor: useColor }}
                            title={colorName}
                        />
                        );
                    })}
                    {product.colorPreview?.length > 3 && (
                        <span className="text-xs text-gray-600 ml-1">
                        +{product.colorPreview.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;