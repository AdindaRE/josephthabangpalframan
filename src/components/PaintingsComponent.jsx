import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IoIosExpand } from 'react-icons/io';
import { CgScrollV } from 'react-icons/cg';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase-config'; // Correct import for Firestore and Storage

gsap.registerPlugin(ScrollTrigger);

// PaintingCard Component
const PaintingCard = ({ painting, onExpand }) => (
    <div
        className={`relative group overflow-hidden cursor-pointer painting-card
            w-full sm:w-[calc(50%-12px)] ${painting.id % 2 === 0 ? 'h-[60vh]' : 'h-[80vh]'}`}
    >
        <img
            src={painting.src} // Image URL from Firebase Storage
            alt={painting.caption}
            className="w-full h-full object-cover lazyload transition-transform duration-300 transform group-hover:scale-105"
            loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-white text-sm text-center font-open-sans">
                <p>{painting.caption}</p>
                <p>Measurements: {painting.measurements}</p>
                <p>Medium: {painting.medium}</p>
                <p>Gallery: {painting.gallery}</p>
            </div>
        </div>
        {/* Expand icon */}
        <div
            className="absolute bottom-4 right-4 text-black text-2xl opacity-100 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            onClick={(e) => {
                e.stopPropagation(); // Prevent click event from bubbling up
                onExpand(painting);
            }}
        >
            <IoIosExpand className="text-black group-hover:text-white transition-colors duration-300" />
        </div>
    </div>
);

// Prop validation for PaintingCard component
PaintingCard.propTypes = {
    painting: PropTypes.shape({
        id: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
        caption: PropTypes.string,
        measurements: PropTypes.string,
        medium: PropTypes.string,
        gallery: PropTypes.string,
    }).isRequired,
    onExpand: PropTypes.func.isRequired,
};

// ExpandedPaintingModal Component
const ExpandedPaintingModal = ({ painting, onClose }) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
        onClick={onClose}
    >
        <div className="relative">
            <img
                src={painting.src}
                alt={painting.caption}
                className="max-w-full max-h-full object-cover"
            />
            <button
                className="absolute top-4 right-4 text-white text-4xl"
                onClick={onClose}
            >
                &times;
            </button>
        </div>
    </div>
);

// Prop validation for ExpandedPaintingModal component
ExpandedPaintingModal.propTypes = {
    painting: PropTypes.shape({
        src: PropTypes.string.isRequired,
        caption: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
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

    const fetchPaintings = async () => {
        try {
            const paintingsCollection = collection(db, 'paintings');
            const paintingSnapshot = await getDocs(paintingsCollection);
            const paintingData = await Promise.all(
                paintingSnapshot.docs.map(async (doc) => {
                    const painting = doc.data();
                    if (painting.imagePath) {
                        const imageRef = ref(storage, painting.imagePath);
                        const imageUrl = await getDownloadURL(imageRef);
                        return { id: doc.id, ...painting, src: imageUrl };
                    }
                    return { id: doc.id, ...painting };
                })
            );
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
        const paintings = document.querySelectorAll('.painting-card');
        paintings.forEach((painting, index) => {
            gsap.fromTo(
                painting,
                { opacity: 0, y: 100 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: painting,
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
                        <PaintingCard
                            key={painting.id}
                            painting={painting}
                            onExpand={handleExpand}
                        />
                    ))}
                </div>
            </div>

            {/* Expanded painting modal */}
            {expandedPainting && (
                <ExpandedPaintingModal
                    painting={expandedPainting}
                    onClose={closeExpand}
                />
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
