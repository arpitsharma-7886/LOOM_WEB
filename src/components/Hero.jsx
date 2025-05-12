// import React from 'react';
// import Slider from 'react-slick';
// import image1 from '../assets/images/new-arrivals.png';
// import image2 from '../assets/images/HotSelling.png';
// import image3 from '../assets/images/BlackPinkHalfStripedShirt_1.jpg'

// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// const Hero = () => {
//     const settings = {
//         dots: true,
//         infinite: true,
//         speed: 600,
//         autoplay: true,
//         autoplaySpeed: 3000,
//         slidesToShow: 1,
//         slidesToScroll: 1,
//         arrows: true,
//         appendDots: dots => (
//             <div style={{ position: 'absolute', bottom: '20px', width: '100%' }}>
//                 <ul className="flex justify-center gap-3">{dots}</ul>
//             </div>
//         ),
//         customPaging: i => (
//             <div className="dot-wrapper">
//                 <div className="dot-fill"></div>
//             </div>
//         ),
//     };


//     const slides = [
//         {
//             src: image1,
//             heading: 'LINEN EDIT',
//             links: ['Shirts', 'Trousers'],
//         },
//         {
//             src: image2,
//             heading: 'NEW ARRIVALS',
//             links: ['Tees', 'Denims'],
//         },
//         {
//             src: image2,
//             heading: 'NEW ARRIVALS',
//             links: ['Tees', 'Denims'],
//         },
//     ];

//     return (
//         <section className="relative w-full overflow-hidden">
//             {/* Search Bar */}
//             <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-50 w-[85%] md:w-[55%]">
//                 <input
//                     type="text"
//                     placeholder='Search "jeans"'
//                     className="w-full px-6 py-3 border border-white shadow-xl text-black outline-none placeholder-gray-600 text-sm md:text-base"
//                 />
//             </div>

//             {/* Slider */}
//             <Slider {...settings}>
//                 {slides.map((slide, index) => (
//                     <div key={index} className="relative h-[95vh] w-[98%] mx-auto">
//                         <img
//                             src={slide.src}
//                             alt={`Slide ${index + 1}`}
//                             className="w-full h-full object-cover rounded-md"
//                         />

//                         {/* Overlay Text */}
//                         <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-24 text-white bg-black/20">
//                             <h1 className="text-4xl md:text-6xl font-bold mb-3 text-center drop-shadow-xl">
//                                 {slide.heading}
//                             </h1>
//                             <div className="flex gap-5">
//                                 {slide.links.map((label, i) => (
//                                     <a
//                                         key={i}
//                                         href="#"
//                                         className="text-lg md:text-xl underline hover:text-gray-300 transition"
//                                     >
//                                         {label}
//                                     </a>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </Slider>

//             {/* Running Marquee */}
//             <div className="w-full bg-black text-white py-2 overflow-hidden">
//                 <div className="whitespace-nowrap animate-marquee text-sm md:text-base font-medium px-4">
//                     🔥 Summer Collection | 30% OFF on Trousers | Free Shipping Above ₹999 | New Linen Shirts Available Now 🔥
//                 </div>
//             </div>

//             {/* Custom CSS for marquee animation */}
//             <style>
//                 {`
//                     .animate-marquee {
//                         display: inline-block;
//                         animation: marquee 20s linear infinite;
//                     }

//                     @keyframes marquee {
//                         0% { transform: translateX(100%); }
//                         100% { transform: translateX(-100%); }
//                     }

//                     .dot-wrapper {
//                         width: 12px;
//                         height: 12px;
//                         border-radius: 9999px;
//                         background-color: rgba(255, 255, 255, 0.3);
//                         overflow: hidden;
//                         position: relative;
//                     }

//                     .slick-dots li.slick-active .dot-fill {
//                         animation: fillDot 3s linear forwards;
//                     }

//                     .dot-fill {
//                         content: "";
//                         position: absolute;
//                         top: 0;
//                         left: 0;
//                         height: 100%;
//                         width: 0%;
//                         background-color: white;
//                     }

//                     @keyframes fillDot {
//                         from { width: 0%; }
//                         to { width: 100%; }
//                     }
//         `}
//             </style>
//         </section>
//     );
// };

// export default Hero;


import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '../ui/Button';

const slides = [
    {
        image: 'https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: 'POLO SHIRTS',
        subtitle: 'The smartest way to chill',
        buttonText: 'SHOP POLOS',
        buttonLink: '/products?category=polos'
    },
    {
        image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: 'SUMMER COLLECTION',
        subtitle: 'Embrace the season in style',
        buttonText: 'SHOP NOW',
        buttonLink: '/products?category=summer'
    },
    {
        image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: 'NEW ARRIVALS',
        subtitle: 'Fresh styles just landed',
        buttonText: 'EXPLORE',
        buttonLink: '/products?category=new'
    }
];

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timer);
    }, [currentSlide]);

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

    return (
        <section className="relative h-screen overflow-hidden">

            {/* Animated Search Bar */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 w-[60%]">
                <div className="flex items-center">
                    <div className="relative flex items-center h-10 border border-white w-full cursor-pointer mx-4">
                        {/* Search Icon */}
                        <div className="ml-2">
                            <span>
                                <Search strokeWidth={0.75} className='text-white' />
                            </span>
                        </div>

                        {/* Input (readonly) */}
                        <input
                            className="flex-1 h-full w-full bg-transparent focus:outline-none px-3 text-white placeholder-white"
                            value=""
                        />

                        {/* Animated Suggestions */}
                        <div className="pointer-events-none absolute h-full w-full px-5 ml-5 flex items-center">
                            <div className="relative h-7 w-full overflow-hidden">
                                <div className="absolute inset-0 flex flex-col justify-center text-white text-xs font-light font-[NewHeroTRIAL-Light] transition-all duration-500 ease-in-out">
                                    {/* Active suggestion (visible) */}
                                    <div className="flex absolute transform translate-y-0 opacity-100 transition-all duration-500">
                                        <div className="py-1 px-1">Search "white shirt"</div>
                                    </div>

                                    {/* Add more if needed */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
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
                            <div className="max-w-lg ml-[140px] mt-[130px]">
                                <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
                                    {slide.title}
                                </h2>
                                <p className="text-xl md:text-2xl text-white mb-8 animate-fade-in">
                                    {slide.subtitle}
                                </p>
                                <Button
                                    variant="primary"
                                    className="bg-white !text-black hover:bg-gray-100 hover:!text-white px-8 py-3 text-lg animate-fade-in"
                                >
                                    {slide.buttonText}
                                </Button>

                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
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

            {/* Dots Navigation */}
            <div className="absolute mb-[40px] bottom-8 left-0 right-0 flex justify-center gap-3 z-30">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                            ? 'bg-white scale-100'
                            : 'bg-white/50 scale-75 hover:scale-90'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Bottom Banner */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white py-2 z-30">
                <div className="container mx-auto px-4 animate-marquee">
                    <div className="flex items-center justify-center gap-6 text-sm font-medium">
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

