import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const paintingsData = [
    { src: 'public/assets/images/paintings/_Can Click It_, 2024, Oil and Acrylic and Canvas .jpg', caption: 'Can Click It, 2024' },
    { src: 'public/assets/images/paintings/1986 Sanctions advocation protest in Canada led by Desmond Tutu, 2024, Oil and Canvas No 2.jpg', caption: 'Sanctions Advocacy Protest, 2024' },
    { src: 'public/assets/images/paintings/1986 Sanctions advocation protest in Canada led by Desmond Tutu, 2024, Oil and Canvas.jpg', caption: 'Sanctions Advocacy Protest, 2024' },
    { src: 'public/assets/images/paintings/Euro Starz, Oil and Acrylic and Canvas, 2021.jpg', caption: 'Euro Starz, 2021' },
    { src: 'public/assets/images/paintings/General Budget Before June, 2024, Oil and Acrylic and Canvas.jpg', caption: 'General Budget Before June, 2024' },
    { src: 'public/assets/images/paintings/Last Resort (Jacuzzi, Swimming Pool and Palm Tree), Oil and Acrylic and Board, 2023.jpg', caption: 'Last Resort, 2023' },
    { src: 'public/assets/images/paintings/Sint-Geertruikerk, Oil and Acrylic and Board, 2023.jpg', caption: 'Sint-Geertruikerk, 2023' },
    { src: 'public/assets/images/paintings/Sleeping Monster in Red, Acrylic and Canvas, 2022.jpg', caption: 'Sleeping Monster in Red, 2022' },
    { src: 'public/assets/images/paintings/Speech (Club Destiny), Oil and Acrylic and Canvas, 2022.jpg', caption: 'Speech, 2022' },
    { src: 'public/assets/images/paintings/Study back stage music video, Oil and Acrylic and Board, 2019.jpg', caption: 'Study Back Stage, 2019' },
    { src: 'public/assets/images/paintings/Study from Portrait of Den Haag Man, Oil and Wood, 2021.jpg', caption: 'Study from Portrait of Den Haag Man, 2021' },
    { src: 'public/assets/images/paintings/Study of Sunflower, Oil and Acrylic and Board, 2021.jpg', caption: 'Study of Sunflower, 2021' },
    { src: 'public/assets/images/paintings/Tent (black on black), Oil on dyed Canvas, 2022.jpg', caption: 'Tent, 2022' },
    { src: 'public/assets/images/paintings/The Guardian, Oil and Acrylic and Wood, 2020 .jpg', caption: 'The Guardian, 2020' },
    { src: 'public/assets/images/paintings/The Baggage Handler (fisherman), Oil and Acrylic and Board, 2024.jpg', caption: 'The Baggage Handler, 2024' },
];

const PaintingsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsToShow = 3;
    const carouselRef = useRef(null);
    const autoplayRef = useRef(null);

    useEffect(() => {
        const paintings = document.querySelectorAll('.painting-card');
        gsap.fromTo(
            paintings,
            { opacity: 0, x: 100 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power2',
                stagger: {
                    amount: 0.3,
                    from: "start"
                }
            }
        );
    }, []);

    useEffect(() => {
        autoplayRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(paintingsData.length / itemsToShow));
        }, 2000);

        return () => clearInterval(autoplayRef.current);
    }, []);

    const displayedPaintings = paintingsData.slice(currentIndex * itemsToShow, currentIndex * itemsToShow + itemsToShow);

    return (
        <section className="bg-[#f4f4f2] relative w-full py-24 px-4 md:px-12 overflow-hidden">
            <div className="text-left mb-16 max-w-screen-xl mx-auto">
                <h2 className="text-6xl font-light tracking-tight font-open-sans mb-10 flex items-center">
                    Studio Work
                </h2>
            </div>
            <div className="max-w-screen-xl mx-auto">
                <div
                    className="flex transition-transform duration-300 ease-in-out"
                    ref={carouselRef}
                    style={{ transform: `translateX(0px)` }}
                >
                    {displayedPaintings.map((painting, index) => (
                        <Link
                            to="/paintings" // Ensure this is the correct route
                            key={index}
                            className="relative group overflow-hidden cursor-pointer painting-card"
                            style={{ height: '60vh', width: 'calc(33.33% - 1rem)', marginLeft: index === 0 ? '0' : '1rem', marginRight: index === displayedPaintings.length - 1 ? '0' : '1rem' }}
                        >
                            <img
                                src={painting.src}
                                alt={painting.caption}
                                className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-lg font-light font-open-sans leading-relaxed text-white text-center" style={{ letterSpacing: '0.8px' }}>
                                    {painting.caption}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="text-center mt-12 max-w-screen-xl mx-auto mb-12">
                <Link
                    to="/paintings"
                    className="text-xl leading-[1.2em] tracking-[0.8px] text-black bg-[#f4f4f2] px-8 py-3 rounded-full border border-black transition-transform transform duration-200 hover:translate-y-[-3px] hover:opacity-80"
                >
                    View Gallery
                </Link>
            </div>
        </section>
    );
};

export default PaintingsSection;
