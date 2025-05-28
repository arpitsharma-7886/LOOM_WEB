import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import axios from 'axios';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBanners = async () => {
        try {
            const response = await axios.get('http://192.168.29.92:3000/api/user/banners');
            if (response.data.success) {
                // Filter only active banners and map them to the required format
                const activeBanners = response.data.banners
                    // .filter(banner => banner.status === 'Active')
                    .map(banner => ({
                        image: banner.image,
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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <section className="relative h-screen overflow-hidden">

            {/* Animated Search Bar */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 w-[40%]">
                <div className="flex items-center">
                    <div className="relative flex items-center h-10 border border-white w-full cursor-pointer mx-4">
                        {/* Search Icon */}
                        <div className="ml-2">
                            <span>
                                <Search strokeWidth={0.75} className='text-white' />
                            </span>
                        </div>

                        {/* Input */}
                        <input
                            className="flex-1 h-full w-full bg-transparent focus:outline-none px-3 text-white "
                            value={searchQuery}
                            placeholder="Search..."
                            onChange={handleSearchChange}
                        />

                        {/* Animated Suggestions */}
                        {/* <div className="pointer-events-none absolute h-full w-full px-5 ml-5 flex items-center">
                            <div className="relative h-7 w-full overflow-hidden">
                                <div className="absolute inset-0 flex flex-col justify-center text-white text-xs font-light font-[NewHeroTRIAL-Light] transition-all duration-500 ease-in-out"> */}
                                    {/* Active suggestion (visible) */}
                                    {/* <div className="flex absolute transform translate-y-0 opacity-100 transition-all duration-500">
                                        <div className="py-1 px-1">Search "white shirt"</div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
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
                                src={slide.image}
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
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

