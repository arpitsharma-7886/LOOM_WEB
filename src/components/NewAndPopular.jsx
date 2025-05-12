import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart } from 'lucide-react';
import ProductCard from './ProductCard';

const categories = ["All", "Shirts", "Trousers", "T-Shirts", "Jeans", "Co-ords"];


const NewAndPopular = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();

  const fetchProducts = async (pageNum = 1) => {
    try {
      const res = await fetch(`https://mxemjhp3rt.ap-south-1.awsapprunner.com/products/new-and-popular/v2?page=${pageNum}&limit=50`);
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

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const lastProductRef = useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [hasMore]);

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter(p => p.shopify_product_type === activeCategory);

  return (
    <div className="py-10 px-5 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-10">NEW AND POPULAR</h2>
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setProducts([]); // Reset products when category changes
              setPage(1);
              setHasMore(true);
            }}
            className={`px-4 py-2 border rounded-md text-sm font-medium ${activeCategory === cat
              ? "bg-black text-white"
              : "bg-white text-black border-gray-300"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => {
            const isLastProduct = index === filteredProducts.length - 1;
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
  );
};

export default NewAndPopular;
