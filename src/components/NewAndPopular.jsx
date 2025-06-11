import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const categories = ["All", "Shirts", "Trousers", "T-Shirts", "Jeans", "Co-ords"];

const NewAndPopular = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();

  const fetchProducts = async (pageNum = 1, category = activeCategory) => {
    try {
      const res = await axios.get(`https://product-api.compactindiasolutions.com/product/admin/cat_sub/get_sucategories_user?limit=20&page=${pageNum}`);
      const data = res?.data;

      if (data?.success) {
        const newProducts = data.data.products;

        if (data.data.totalPages <= pageNum) {
          setHasMore(false);
        }

        setProducts((prev) => {
          const combined = pageNum === 1 ? newProducts : [...prev, ...newProducts];
          const unique = Array.from(new Map(combined.map(p => [p._id, p])).values());
          return unique;
        });
      }
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

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

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchProducts(1, cat);
  };

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter(p => p.subcategory?.name === activeCategory);

  return (
    <div className="py-4 sm:py-8 md:py-10 px-3 sm:px-4 md:px-5 bg-gray-50">
      <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-10">NEW AND POPULAR</h2>

      {/* Categories */}
      <div className="overflow-x-auto pb-2 mb-4 sm:mb-6">
        <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-2 min-w-min px-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 border rounded-md text-sm whitespace-nowrap font-medium transition-colors duration-200 ${
                activeCategory === cat
                ? "bg-black text-white"
                : "bg-white text-black border-gray-300 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-2 sm:px-4 md:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredProducts.map((product, index) => {
            const isLastProduct = index === filteredProducts.length - 1;
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
          <div className="text-center text-gray-500 mt-4 sm:mt-6">No more products to load.</div>
        )}
      </div>
    </div>
  );
};

export default NewAndPopular;
