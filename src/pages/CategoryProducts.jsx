import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import MainTemplate from '../components/MainTemplate';

const CategoryProducts = () => {
    const { id } = useParams();
    const { name } = useParams();
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef();

    console.log(products, 'products');


    const fetchedProducts = async () => {
        const response = await axios.get(`http://192.168.29.81:3002/product/admin/prod/get_product_BySubcategory3/${id}`)
        console.log(response?.data, "response ")
    
        if(response?.data?.success){
            setProducts(response?.data?.data?.products);
            if (response?.data?.data?.products?.length === 0) {
                    setHasMore(false); // No more products
                } else {
                    setProducts(response?.data?.data?.products)
                }
            
        }

        
    }

    useEffect(() => {
        fetchedProducts()
    }, [])

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
        <MainTemplate>
            <h2 className="text-3xl font-bold text-center mb-10">{name.toUpperCase()}</h2>
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => {
                        const isLastProduct = index === products.length - 1;
                        return (
                            <div
                                key={product._id}
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
        </MainTemplate>
    )
}

export default CategoryProducts