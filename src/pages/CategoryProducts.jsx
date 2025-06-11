import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import MainTemplate from '../components/MainTemplate';
import { ChevronDown, X, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import RangeSlider from '../components/ui/RangeSlider';

const CategoryProducts = () => {
  const { id, name } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 5000
  });
  const [tempFilters, setTempFilters] = useState({
    minPrice: 0,
    maxPrice: 5000
  });
  const [loading, setLoading] = useState(true);

  const sortOptions = [
    { value: 'newest', label: 'Newest', apiValue: 'newest' },
    { value: 'popular', label: 'Popular', apiValue: 'popular' },
    { value: 'price_low_high', label: 'Price: Low to High', apiValue: 'priceLowToHigh' },
    { value: 'price_high_low', label: 'Price: High to Low', apiValue: 'priceHighToLow' },
    { value: 'discount_high_low', label: 'Discount: High to Low', apiValue: 'discountHighToLow' },
  ];

  const fetchAttributes = async () => {
    try {
      const response = await axios.get('https://product-api.compactindiasolutions.com/product/admin/cat_sub/get_subcategories');
      if (response?.data?.success) {
        const subcategory = response.data.data.results.find(sub => sub._id === id);
        if (subcategory) {
          setAttributes(subcategory.attributes);
          const initialFilters = {
            minPrice: 0,
            maxPrice: 5000,
          };
          subcategory.attributes.forEach(attr => {
            initialFilters[attr.name] = [];
          });
          setFilters(initialFilters);
          setTempFilters(initialFilters);
        }
      }
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
  };

  const buildApiUrl = () => {
    let url = `http://192.168.29.92:3002/product/admin/prod/get_product_BySubcategory3/${id}`;
    const params = new URLSearchParams();
    const selectedSort = sortOptions.find(option => option.value === sortBy);
    if (selectedSort) params.append('sort', selectedSort.apiValue);

    Object.entries(filters).forEach(([key, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        params.append(key, values.join(','));
      } else if (key === 'minPrice' || key === 'maxPrice') {
        params.append(key, values);
      }
    });

    return `${url}?${params.toString()}`;
  };

  const fetchedProducts = async () => {
    try {
      setLoading(true);
      const url = buildApiUrl();
      const response = await axios.get(url);
      if (response?.data?.success) {
        const productsData = response?.data?.data?.products || [];
        setProducts(productsData);
        setHasMore(productsData.length > 0);
      } else {
        setProducts([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, [id]);

  useEffect(() => {
    setProducts([]);
    fetchedProducts();
  }, [id, sortBy, filters]);

  const handleFilterChange = (attributeName, value) => {
    setTempFilters(prev => ({
      ...prev,
      [attributeName]: prev[attributeName].includes(value)
        ? prev[attributeName].filter(item => item !== value)
        : [...prev[attributeName], value],
    }));
  };

  const applyFilters = () => {
    setFilters({ ...tempFilters });
    setShowFilters(false);
  };

  const clearFilters = () => {
    const cleared = {
      minPrice: 0,
      maxPrice: 5000,
    };
    attributes.forEach(attr => {
      cleared[attr.name] = [];
    });
    setTempFilters(cleared);
    setFilters(cleared);
    setShowFilters(false);
  };

  const lastProductRef = useCallback(
    node => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore]
  );

  return (
    <MainTemplate>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h2 className="text-3xl font-bold">{name?.toUpperCase()}</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Sort By</option>
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full flex items-center justify-center min-h-[400px]">
                  <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                products.map((product, index) => {
                  const isLastProduct = index === products.length - 1;
                  return (
                    <div key={product._id} ref={isLastProduct ? lastProductRef : null}>
                      <ProductCard product={product} />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Filter Sidebar */}
          <div
            className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-50 transition-opacity duration-300 ${
              showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setShowFilters(false)}
          >
            <div
              className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                showFilters ? 'translate-x-0' : 'translate-x-full'
              }`}
              onClick={e => e.stopPropagation()}
            >
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Filter Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Price Range */}
                  <div className="mb-10">
                    <h4 className="font-semibold text-gray-800 text-lg mb-4">Price Range</h4>
                    <div className="px-2">
                      <RangeSlider
                        min={0}
                        max={5000}
                        step={100}
                        value={[tempFilters.minPrice, tempFilters.maxPrice]}
                        onChange={([min, max]) => {
                          setTempFilters(prev => ({
                            ...prev,
                            minPrice: min,
                            maxPrice: max
                          }));
                        }}
                      />
                      <div className="flex justify-between mt-4 text-sm text-gray-600 font-medium">
                        <span>₹{tempFilters.minPrice}</span>
                        <span>₹{tempFilters.maxPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Attribute Filters */}
                  {attributes.map(attr => (
                    <div key={attr._id} className="mb-8">
                      <h4 className="font-medium mb-3 text-gray-800 text-lg">
                        {attr.name.charAt(0).toUpperCase() + attr.name.slice(1)}
                      </h4>
                      <div className="space-y-2">
                        {attr.values.map(value => (
                          <label key={value} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={tempFilters[attr.name]?.includes(value)}
                              onChange={() => handleFilterChange(attr.name, value)}
                              className="w-5 h-5 text-black rounded focus:ring-black"
                            />
                            <span className="text-gray-600 group-hover:text-black">{value}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-white">
                  <div className="flex gap-4">
                    <button
                      onClick={clearFilters}
                      className="flex-1 py-3 border-2 border-black text-black font-semibold rounded-lg hover:bg-gray-50"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={applyFilters}
                      className="flex-1 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!hasMore && products.length > 0 && (
          <div className="text-center text-gray-500 mt-6">No more products to load.</div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-6">No products found matching your filters.</div>
        )}
      </div>
    </MainTemplate>
  );
};

export default CategoryProducts;
