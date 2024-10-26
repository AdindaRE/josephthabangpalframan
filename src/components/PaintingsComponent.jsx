import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CgScrollV } from 'react-icons/cg';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config'; // Correct import for Firestore

gsap.registerPlugin(ScrollTrigger);

// TitleCard Component
const TitleCard = ({ painting, onExpand }) => (
    <div
        className="border border-gray-200 rounded-lg shadow-lg overflow-hidden bg-white p-4 flex flex-col space-y-4"
        onClick={() => onExpand(painting)}
    >
        <p className="text-xl font-semibold">{painting.caption}</p>
        <p className="text-sm text-gray-600">{painting.measurements}</p>
        <p className="text-sm text-gray-600">{painting.medium}</p>
        <p className="text-sm text-gray-600">{painting.gallery}</p>
    </div>
);

// Prop validation for TitleCard component
TitleCard.propTypes = {
    painting: PropTypes.shape({
        id: PropTypes.string.isRequired,
        caption: PropTypes.string,
        measurements: PropTypes.string,
        medium: PropTypes.string,
        gallery: PropTypes.string,
    }).isRequired,
    onExpand: PropTypes.func.isRequired,
};

// ScrollToTopButton Component
const ScrollToTopButton = ({ isVisible, onClick }) => (
    isVisible && (
        <button
            className="fixed bottom-10 right-10 bg-black text-white p-4 rounded-full shadow-lg z-50"
            onClick={onClick}
        >
            <CgScrollV size={24} />
        </button>
    )
);

// Prop validation for ScrollToTopButton component
ScrollToTopButton.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

const PaintingsComponent = () => {
    const [paintings, setPaintings] = useState([]);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [expandedPainting, setExpandedPainting] = useState(null);

    // Fetch paintings from Firestore
    const fetchPaintings = async () => {
        try {
            const paintingsCollection = collection(db, 'paintings');
            const paintingSnapshot = await getDocs(paintingsCollection);
            const paintingData = paintingSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPaintings(paintingData);
        } catch (error) {
            console.error("Error fetching paintings: ", error);
        }
    };

    useEffect(() => {
        fetchPaintings();
    }, []);

    // Handle scroll event to show/hide the scroll-to-top button
    const handleScroll = () => {
        setShowScrollToTop(window.scrollY > 300);
    };

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Expand image function
    const handleExpand = (painting) => {
        setExpandedPainting(painting);
    };

    // Close expanded image
    const closeExpand = () => {
        setExpandedPainting(null);
    };

    // Attach scroll event listener on component mount and cleanup on unmount
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // GSAP Animation for paintings
    useEffect(() => {
        const titleCards = document.querySelectorAll('.painting-card');
        titleCards.forEach((card, index) => {
            gsap.fromTo(
                card,
                { opacity: 0, y: 100 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom',
                        toggleActions: 'play none none none',
                    },
                }
            );
        });
    }, [paintings]);

    return (
        <div className="bg-white text-black py-20 ">
            <div className="relative bg-white flex flex-col items-center mt-16">
                <h1 className="w-[calc(40%-2rem)] text-center text-6xl font-light text-black bg-transparent opacity-90 py-8 z-20">
                    Studio Work
                </h1>
            </div>

            <div className="max-w-screen-xl mx-auto">
                <div className="flex flex-wrap gap-6 justify-center">
                    {paintings.map((painting) => (
                        <TitleCard
                            key={painting.id}
                            painting={painting}
                            onExpand={handleExpand}
                        />
                    ))}
                </div>
            </div>

            {/* Expanded painting modal (optional if you want to show more details) */}
            {expandedPainting && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                    <div className="relative">
                        <h2 className="text-white">{expandedPainting.caption}</h2>
                        {/* Add more details or an image here if needed */}
                        <button
                            className="absolute top-4 right-4 text-white text-4xl"
                            onClick={closeExpand}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

            {/* Scroll to top button */}
            <ScrollToTopButton
                isVisible={showScrollToTop}
                onClick={scrollToTop}
            />
        </div>
    );
};

export default PaintingsComponent;
