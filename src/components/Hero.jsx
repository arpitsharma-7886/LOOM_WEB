import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, X, Clock, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem('recentSearches');
        return saved ? JSON.parse(saved).slice(0, 8) : [];
    });
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const addToRecentSearches = (query) => {
        setRecentSearches(prev => {
            const filtered = prev.filter(item => item !== query);
            const updated = [query, ...filtered].slice(0, 8);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
            return updated;
        });
    };

    const removeRecentSearch = (queryToRemove) => {
        setRecentSearches(prev => {
            const updated = prev.filter(query => query !== queryToRemove);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
            return updated;
        });
    };

    const fetchBanners = async () => {
        try {
            const response = await axios.get('https://admin-api.compactindiasolutions.com/api/user/banners');
            console.log(response, 'response');
            
            if (response.data.success) {
                // Filter only active banners and map them to the required format
                const activeBanners = response.data.banners
                    // .filter(banner => banner.status === 'Active')
                    .map(banner => ({
                        webImage: banner.webImage,
                        title: banner.title,
                        subtitle: '', // Add subtitle if available in API
                        buttonText: 'Shop Now' // Default button text
                    }));
                setSlides(activeBanners);
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        if (slides.length > 0) {
            const timer = setInterval(() => {
                nextSlide();
            }, 5000);

            return () => clearInterval(timer);
        }
    }, [currentSlide, slides.length]);

    const nextSlide = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            setTimeout(() => setIsTransitioning(false), 500);
        }
    };

    const prevSlide = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
            setTimeout(() => setIsTransitioning(false), 500);
        }
    };

    const goToSlide = (index) => {
        if (!isTransitioning && index !== currentSlide) {
            setIsTransitioning(true);
            setCurrentSlide(index);
            setTimeout(() => setIsTransitioning(false), 500);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            addToRecentSearches(searchQuery.trim());
            setShowSuggestions(false);
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        addToRecentSearches(suggestion);
        setShowSuggestions(false);
        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    };

    return (
        <section className="relative h-screen overflow-hidden">
            {/* Search Bar */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl" ref={searchRef}>
                <div className="relative">
                    <form onSubmit={handleSearch} className="flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                        {/* Search Icon */}
                        <div className="pl-4">
                            <Search className="w-5 h-5 text-white" />
                        </div>

                        {/* Input */}
                        <input
                            className="flex-1 h-12 bg-transparent focus:outline-none px-4 text-white placeholder-white/70"
                            value={searchQuery}
                            placeholder="Search..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                        />

                        {/* Clear Button */}
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setShowSuggestions(false);
                                }}
                                className="pr-4 text-white/70 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}

                        {/* Search Button */}
                        <button
                            type="submit"
                            className="px-6 h-12 bg-white/10 hover:bg-white/20 text-white rounded-r-full transition-colors"
                        >
                            Search
                        </button>
                    </form>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl overflow-hidden">
                            <div className="p-4">
                                {/* Recent Searches */}
                                {recentSearches.length > 0 && (
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-medium text-gray-500">Recent Searches</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {recentSearches.map((search, index) => (
                                                <div key={index} className="group relative">
                                                    <button
                                                        onClick={() => handleSuggestionClick(search)}
                                                        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors pr-8"
                                                    >
                                                        {search}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeRecentSearch(search);
                                                        }}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Popular Searches */}
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>Popular Searches</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {['Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Cargos', 'Shorts'].map((suggestion) => (
                                            <button
                                                key={suggestion}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                </div>
            )}

            {/* Slides */}
            {slides.length > 0 ? (
                slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
                            <img
                                src={slide.webImage}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="relative z-20 h-full flex items-center">
                            <div className="container mx-auto px-4">
                                <div className='flex justify-center items-center'>
                                    <div className="w-full flex flex-col items-center">
                                        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in text-center">
                                            {slide.title}
                                        </h2>
                                        {slide.subtitle && (
                                            <p className="text-xl md:text-2xl text-white mb-8 animate-fade-in">
                                                {slide.subtitle}
                                            </p>
                                        )}
                                        <Button
                                            variant="primary"
                                            className="bg-white !text-black hover:bg-transparent hover:!text-white hover:!border-2 hover:!border-white px-8 py-3 text-lg animate-fade-in"
                                        >
                                            {slide.buttonText}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : !loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">No banners available</p>
                </div>
            )}

            {/* Navigation Arrows - Only show if there are slides */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-gray-900/50 hover:bg-gray-900/100 text-white transition-all"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-gray-600/50 hover:bg-gray-900/100 text-white transition-all"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dots Navigation - Only show if there are slides */}
            {slides.length > 1 && (
                <div className="absolute mb-[40px] bottom-8 left-0 right-0 flex justify-center gap-3 z-30">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                    ? 'bg-white scale-100'
                                    : 'bg-white/50 scale-75 hover:scale-90'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Bottom Banner */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white py-2 z-30">
                <div className="container mx-auto px-4 animate-marquee">
                    <div className="flex items-center justify-center gap-6 text-sm font-medium whitespace-nowrap">
                        <span>FREE 7-DAY RETURNS</span>
                        <span className="hidden md:inline">•</span>
                        <span>MADE IN INDIA FOR THE WORLD</span>
                        <span className="hidden md:inline">•</span>
                        <span>FLAT ₹200 OFF ON FIRST ORDER</span>
                    </div>
                </div>
            </div>

            <style>
                {`
                    .animate-marquee {
                        display: inline-block;
                        animation: marquee 30s linear infinite;
                    }

                    @keyframes marquee {
                        0% { transform: translateX(100%); }
                        100% { transform: translateX(-100%); }
                    }

        `}
            </style>
        </section>
    );
};

export default Hero;

