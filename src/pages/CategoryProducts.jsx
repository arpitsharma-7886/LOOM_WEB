import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import MainTemplate from '../components/MainTemplate';
import { ChevronLeft, Search, SlidersHorizontal, Heart, LayoutGrid, Columns, Rows, X } from 'lucide-react';
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
  const [gridView, setGridView] = useState('double');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 5000
  });
  const [tempFilters, setTempFilters] = useState({
    minPrice: 0,
    maxPrice: 5000
  });
  const [loading, setLoading] = useState(true);

  const filterChips = [
    { id: 'new', label: 'NEW' },
    { id: 'luxe', label: 'LUXE' },
    { id: 'plus_size', label: 'PLUS SIZE' },
    { id: 'core_lab', label: 'CORE LAB' },
    { id: 'kurta', label: 'KURTA' },
    { id: 'linen', label: 'LINEN' },
  ];

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
    let url = `https://product-api.compactindiasolutions.com/product/admin/prod/get_product_BySubcategory3/${id}`;
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

  useEffect(() => {
    const handleResize = () => setGridView((prev) => prev); // force re-render
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const getGridClass = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      return 'grid-cols-4';
    }
  
    switch (gridView) {
      case 'single':
        return 'grid-cols-1';
      case 'double':
        return 'grid-cols-2';
      case 'grid':
        return 'grid-cols-2 md:grid-cols-3';
      default:
        return 'grid-cols-2';
    }
  };
  

  return (
    <MainTemplate>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white lg:bg-black border-b border-gray-200 lg:border-none shadow-sm lg:shadow-none">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 lg:hover:bg-black/20 rounded-full text-black lg:text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <h1 className="text-lg font-medium text-black lg:text-white">{name?.toUpperCase()}</h1>
            
            <button className="p-2 hover:bg-gray-100 lg:hover:bg-black/20 rounded-full text-black lg:text-white">
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        {/* Filter Chips */}
        <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="md:flex md:justify-center">
            <div className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 md:max-w-3xl scrollbar-hide">
              {filterChips.map(chip => (
                <button
                  key={chip.id}
                  className="flex-none md:flex-initial px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:border-black transition-colors whitespace-nowrap"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Controls - Only visible on mobile/tablet */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1">
              <button
                onClick={() => setGridView('single')}
                className={`p-1.5 rounded ${
                  gridView === 'single' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Single Column View"
              >
                <Rows className="w-5 h-5" />
              </button>
              <button
                onClick={() => setGridView('double')}
                className={`p-1.5 rounded ${
                  gridView === 'double' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Double Column View"
              >
                <Columns className="w-5 h-5" />
              </button>
              <button
                onClick={() => setGridView('grid')}
                className={`p-1.5 rounded ${
                  gridView === 'grid' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        {/* Filter button for web view */}
        <div className="hidden lg:flex justify-between mb-6 items-center gap-4">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent cursor-pointer hover:border-gray-400 transition-colors"
            >
              <option value="">Sort By</option>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        {/* Product Grid */}
        <div className={`grid gap-4 ${getGridClass()}`}>
          {loading ? (
            <div className="col-span-full flex items-center justify-center min-h-[300px]">
              <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            products.map((product, index) => {
              const isLastProduct = index === products.length - 1;
              return (
                <div key={product._id} ref={isLastProduct ? lastProductRef : null}>
                  <div className="relative group">
                    <ProductCard product={product} />
                    <button className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* No Results Messages */}
        {!hasMore && products.length > 0 && (
          <div className="text-center text-gray-500 mt-6">No more products to load.</div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-6">No products found matching your filters.</div>
        )}

        {/* Filter Sidebar */}
        <div
          className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-50 transition-opacity duration-300 ${
            showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setShowFilters(false)}
        >
          <div
            className={`fixed right-0 top-0 h-full w-full sm:w-[380px] md:w-[420px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
              showFilters ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {/* Price Range */}
                <div className="mb-8 sm:mb-10">
                  <h4 className="font-semibold text-gray-800 text-base sm:text-lg mb-3 sm:mb-4">Price Range</h4>
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
                    <div className="flex justify-between mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 font-medium">
                      <span>₹{tempFilters.minPrice}</span>
                      <span>₹{tempFilters.maxPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Attribute Filters */}
                {attributes.map(attr => (
                  <div key={attr._id} className="mb-6 sm:mb-8">
                    <h4 className="font-medium mb-2 sm:mb-3 text-gray-800 text-base sm:text-lg">
                      {attr.name.charAt(0).toUpperCase() + attr.name.slice(1)}
                    </h4>
                    <div className="space-y-1.5 sm:space-y-2">
                      {attr.values.map(value => (
                        <label key={value} className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={tempFilters[attr.name]?.includes(value)}
                            onChange={() => handleFilterChange(attr.name, value)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-black rounded focus:ring-black"
                          />
                          <span className="text-sm sm:text-base text-gray-600 group-hover:text-black">{value}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t bg-white">
                <div className="flex gap-3 sm:gap-4">
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-2.5 sm:py-3 border-2 border-black text-black text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-50"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={applyFilters}
                    className="flex-1 py-2.5 sm:py-3 bg-black text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-900"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default CategoryProducts;
