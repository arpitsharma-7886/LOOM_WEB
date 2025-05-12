import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FaTruck, FaUndo, FaLock, FaHeart } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import MainTemplate from '../components/MainTemplate';

const ProductDetails = () => {
    const { id } = useParams();
    const [productData, setProductData] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([])
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef();
    const navigate = useNavigate(); 

    console.log(selectedColor, 'sleelc');
    

    const fetchProduct = async () => {
        try {
            const response = await axios.get(
                `https://mxemjhp3rt.ap-south-1.awsapprunner.com/products/product-details?product_id=${id}`
            );
            const data = response.data?.data?.products;
            if (data) setProductData(data);
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const fetchSimilarProducts = async (pageNum = 1) => {
        try {
            const res = await fetch(`https://mxemjhp3rt.ap-south-1.awsapprunner.com/products/similar-products?product_id=${id}&page=${pageNum}&limit=50`);
            const data = await res.json();

            if (data?.status?.code === 200) {
                if (data.data.products.length === 0) {
                    setHasMore(false); // No more products
                } else {
                    setSimilarProducts((prev) => [...prev, ...data.data.products]);
                }
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProduct();
        fetchSimilarProducts(page)
    }, [id, page]);

    const lastProductRef = useCallback((node) => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        if (node) observerRef.current.observe(node);
    }, [hasMore]);

    const handleClick = () => {
        window.location.reload();
        setSelectedColor(navigate(`/product/${variant.shopify_product_id}`))
    }

   
    if (!productData) return <div className="text-center py-20 text-lg">Loading...</div>;

    return (
        <MainTemplate>
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Image Slider */}
                    <div className="space-y-5">
                        <div className="aspect-square w-full rounded-xl overflow-hidden border shadow-sm">
                            <Swiper spaceBetween={10} slidesPerView={1} loop>
                                {productData.images?.map((img, i) => (
                                    <SwiperSlide key={i}>
                                        <img
                                            src={img}
                                            alt={`product-${i}`}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        <div className="flex gap-2 overflow-x-auto">
                            {productData.images?.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`thumb-${i}`}
                                    className="w-16 h-16 object-cover rounded-lg border hover:border-black cursor-pointer transition-all"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6 sticky top-24">
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-semibold text-gray-900">{productData.title}</h1>
                            <FaHeart className="text-gray-400 hover:text-red-500 cursor-pointer text-2xl" />
                        </div>

                        <p className="text-sm text-gray-500">
                            ⭐ {productData.average_rating || 4.0} | {productData.total_rewiews_count || 0} Reviews
                        </p>

                        <div className="text-3xl font-bold text-gray-900">
                            ₹{productData.selling_price?.toFixed(2)}
                        </div>

                        {productData.colors?.length > 0 && (
                            <div>
                                <p className="font-medium text-gray-700 mb-2">Color</p>
                                <div className="flex gap-3">
                                    {productData.color_variants?.map((variant, i) => (
                                        <img
                                            key={i}
                                            src={variant.preview_image}
                                            alt={`variant-${i}`}
                                            className={`w-[70px] h-[80px] rounded-md border-2 cursor-pointer ${selectedColor === variant.shopify_product_id
                                                ? 'border-black'
                                                : 'border-gray-300'
                                                }`}
                                            onClick={handleClick}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <p className="font-medium text-gray-700 mb-2">Quantity</p>
                            <div className="flex items-center border rounded w-max px-2">
                                <button
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="px-3 text-xl font-semibold"
                                >
                                    -
                                </button>
                                <span className="px-4">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="px-3 text-xl font-semibold"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3">
                            <button className="bg-black text-white py-3 rounded-lg text-center hover:opacity-90 transition">
                                Add to Cart
                            </button>
                            <button className="border py-3 rounded-lg text-center hover:bg-gray-100 transition">
                                Buy Now
                            </button>
                        </div>

                        {/* Extra Info Sections */}
                        <div className="divide-y border rounded-lg overflow-hidden mt-4">
                            {['DETAILS', 'DELIVERY', 'RETURNS'].map(title => (
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

                        {/* Info Icons */}
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

                {/* You May Also Like */}
                {productData.color_variants?.length > 1 && (
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-center mb-10">YOU MAY ALSO LIKE</h2>
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {similarProducts.map((product, index) => {
                                    const isLastProduct = index === similarProducts.length - 1;
                                    return (
                                        <div
                                            key={product.shopify_product_id}
                                            ref={isLastProduct ? lastProductRef : null}
                                        >
                                            <ProductCard product={product} />
                                        </div>
                                    );
                                })}
                            </div>
                            {!hasMore && (
                                <div className="text-center text-gray-500 mt-6">No more products to load.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </MainTemplate>
    );
};

export default ProductDetails;
