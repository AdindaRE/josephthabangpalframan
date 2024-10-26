import { useEffect, useState, useRef, useCallback } from 'react';
import { IoIosArrowRoundDown } from "react-icons/io";

const images = [
    'public/assets/images/hero/Act One (installation), 2023.JPG',
    'public/assets/images/hero/casco - zwaar - jw (web res)-42.JPEG',
    'public/assets/images/hero/Light Body and Act 1 (installations), 2023.JPG',
    'public/assets/images/hero/joseph2web.jpg',
];

const HeroSection = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const sectionRef = useRef(null); // Create a ref for the section element

    // Function to go to the next slide
    const nextSlide = useCallback(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, []);

    useEffect(() => {
        // Autoplay functionality
        const autoplay = setInterval(() => {
            nextSlide();
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(autoplay); // Cleanup on unmount
    }, [nextSlide]);

    return (
        <section
            id="hero"
            ref={sectionRef} // Attach the ref to the section element
            className="relative min-h-[80vh] w-full text-[#010358] px-4 md:px-8 py-16 md:py-20 flex items-center justify-center overflow-hidden z-20" // Changed min height to 70vh
        >
            {/* Slideshow Background */}
            <div className="absolute inset-0 z-10 overflow-hidden">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Slide ${index}`}
                        className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            filter: 'brightness(1.1) contrast(1.2) saturate(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                            objectFit: 'cover'
                        }}
                    />
                ))}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 z-20"></div>
            </div>

            {/* Down Arrows */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex z-30">
                <IoIosArrowRoundDown className="text-black text-3xl" style={{ margin: '0 4px' }} />
                <IoIosArrowRoundDown className="text-black text-3xl" style={{ margin: '0 4px' }} />
                <IoIosArrowRoundDown className="text-black text-3xl" style={{ margin: '0 4px' }} />
            </div>
        </section>
    );
};

export default HeroSection;