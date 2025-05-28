import React, { useCallback, useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard'
import axios from 'axios';
import { Link } from 'react-router-dom';

const SimilarProducts = ({ id }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef();

    useEffect(() => {
        const fetchSimilarProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`http://192.168.29.92:3002/product/admin/prod/similar_products/${id}?page=1&limit=50`);
                
                if (response.data?.success) {
                    setProducts(response.data.data || []);
                } else {
                    setError('Failed to load similar products');
                }
            } catch (error) {
                console.error('Error fetching similar products:', error);
                setError('Failed to load similar products');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarProducts();
    }, [id]);

    const fetchSimilarProducts = async (pageNum = 1) => {
        try {
            const res = await fetch(`https://mxemjhp3rt.ap-south-1.awsapprunner.com/products/similar-products?product_id=${id}&page=${pageNum}&limit=50`);
            const data = await res.json();

            if (data?.status?.code === 200) {
                if (data.data.products.length === 0) {
                    setHasMore(false); // No more products
                } else {
                    setProducts((prev) => [...prev, ...data.data.products]);
                }
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const lastProductRef = useCallback((node) => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        if (node) observerRef.current.observe(node);
    }, [hasMore]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="space-y-2">
                                <div className="h-48 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || products.length === 0) {
        return null; // Don't show anything if there's an error or no products
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => (
                    <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="group"
                    >
                        <div className="space-y-2">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={product.images?.[0]}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                {product.title}
                            </h3>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-lg font-bold text-gray-900">
                                    ₹{product.price?.sellingPrice || '—'}
                                </span>
                                {product.price?.mrp && (
                                    <span className="text-sm text-gray-500 line-through">
                                        ₹{product.price.mrp}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SimilarProducts