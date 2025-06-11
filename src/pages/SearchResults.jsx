import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainTemplate from '../components/MainTemplate';
import ProductCard from '../components/ProductCard';
import { Search, X, ArrowLeft } from 'lucide-react';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

    useEffect(() => {
        const fetchResults = async () => {
            if (!searchQuery) {
                setLoading(false);
                return;
            }
            
            setLoading(true);
            try {
                // const response = await axios.get(`https://product-api.compactindiasolutions.com/product/admin/prod/searchAnything?query=${encodeURIComponent(searchQuery)}`);
                const response = await axios.get(`http://192.168.29.92:3002/product/admin/prod/searchAnything?query=${encodeURIComponent(searchQuery)}`);
                console.log('Search API Response:', response.data);
                
                if (response.data.success && response.data.data && response.data.data.products) {
                    console.log(response.data, "123")
                    setProducts(response.data.data.products);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <MainTemplate>
            <div className="container mx-auto px-4 py-8">
                {/* Back to Home Button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="flex items-center bg-white rounded-full border border-gray-200 shadow-sm">
                            <div className="pl-4">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="flex-1 h-12 bg-transparent focus:outline-none px-4 text-gray-900"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="pr-4 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                            <button
                                type="submit"
                                className="px-6 h-12 bg-black text-white rounded-r-full hover:bg-gray-800 transition-colors"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {loading ? 'Searching...' : 
                         products.length > 0 ? 
                         `Found ${products.length} results for "${searchQuery}"` :
                         `No results found for "${searchQuery}"`}
                    </h1>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Results Grid */}
                {!loading && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard 
                                key={product._id} 
                                product={{
                                    ...product,
                                    title: product.title || product.name,
                                    price: product.lowestSellingPrice || product.price,
                                    discount: product.finalDiscountPercent || product.discount,
                                    image: product.variantThumbnail.image
                                }} 
                            />
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">Try different keywords or check your spelling</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['Shirts', 'T-Shirts', 'Jeans', 'Dresses'].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => {
                                        setSearchQuery(suggestion);
                                        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                                    }}
                                    className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainTemplate>
    );
};

export default SearchResults; 