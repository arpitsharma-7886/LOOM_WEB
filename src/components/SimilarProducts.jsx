import React, { useCallback, useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard'

const SimilarProducts = ({ id }) => {
    const [similarProducts, setSimilarProducts] = useState([])
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef();

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
        setPage(1);
        setSimilarProducts([]);
        fetchSimilarProducts(1);
    }, [id]);

    const lastProductRef = useCallback((node) => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        if (node) observerRef.current.observe(node);
    }, [hasMore]);

    return (
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

    )
}

export default SimilarProducts