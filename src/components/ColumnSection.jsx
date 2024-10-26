import { useEffect, useState, useRef, useCallback } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase-config';

const ColumnSection = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [exhibitionDetails, setExhibitionDetails] = useState(null);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef(null);

    // Function to go to the next slide
    const nextSlide = useCallback(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, [images.length]);

    useEffect(() => {
        // Autoplay functionality
        const autoplay = setInterval(nextSlide, 3000);
        return () => clearInterval(autoplay);
    }, [nextSlide]);

    // Fetch upcoming exhibition details from Firestore with a limit
    const fetchExhibitionDetails = useCallback(async () => {
        setLoading(true);
        try {
            const exhibitionsCollectionRef = collection(db, "upcoming_exhibitions");
            const exhibitionsQuery = query(exhibitionsCollectionRef, limit(1));
            const querySnapshot = await getDocs(exhibitionsQuery);
            const exhibitionData = [];

            querySnapshot.forEach((doc) => {
                exhibitionData.push({ id: doc.id, ...doc.data() });
            });

            if (exhibitionData.length > 0) {
                setExhibitionDetails(exhibitionData[0]);
            } else {
                setError("No upcoming exhibitions found.");
            }
        } catch (err) {
            console.error("Error fetching exhibition details:", err);
            setError("Error fetching exhibition details. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch exhibition images from Firestore
    const fetchExhibitionImages = useCallback(async () => {
        try {
            const imagesCollectionRef = collection(db, 'exhibition_images');
            const imagesSnapshot = await getDocs(imagesCollectionRef);
            const imagesData = imagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setImages(imagesData);
        } catch (err) {
            console.error("Error fetching exhibition images:", err);
            setError("Failed to fetch exhibition images.");
        }
    }, []);

    // Fetch exhibition details and images only once when component mounts
    useEffect(() => {
        fetchExhibitionDetails();
        fetchExhibitionImages();
    }, [fetchExhibitionDetails, fetchExhibitionImages]);

    // Local function to escape quotes in strings
    const escapeQuotes = (str) => str.replace(/"/g, '&quot;');

    // Local function to render loading and error messages
    const renderLoadingError = () => {
        if (error) {
            return <div className="text-red-500">{error}</div>;
        }
        if (loading) {
            return <div>Loading...</div>;
        }
        return null;
    };

    // Local function to render exhibition details
    const renderExhibitionDetails = () => {
        if (!exhibitionDetails) return null;

        return (
            <div className="w-full md:w-1/2 bg-white relative min-h-[100vh] p-8">
                <div className="grid grid-cols-3 grid-rows-3 gap-6 w-full h-full relative">
                    <div className="col-start-1 row-start-1 self-end">
                        <h2 className="text-4xl md:text-5xl font-light uppercase tracking-tight font-open-sans leading-tight">
                            {escapeQuotes(exhibitionDetails.date)}
                        </h2>
                    </div>
                    <div className="col-start-2 row-start-2 self-center justify-self-center">
                        <h2 className="text-xl leading-[1.2em] tracking-[0.8px] text-black font-sans text-center">
                            &quot;{escapeQuotes(exhibitionDetails.quote)}&quot;
                        </h2>
                    </div>
                    <div className="col-start-3 row-start-3 self-end text-right">
                        <p className="text-xl leading-[1.2em] tracking-[0.8px] text-black font-sans">
                            {escapeQuotes(exhibitionDetails.location.name)}<br />
                            {escapeQuotes(exhibitionDetails.location.address)}<br />
                            {escapeQuotes(exhibitionDetails.location.city)}
                        </p>
                    </div>
                    <div className="col-start-1 row-start-2">
                        <h3 className="text-xl tracking-wide font-sans text-gray-600">
                            Free Entry - {escapeQuotes(exhibitionDetails.title)}<br />
                            Entry Details: {escapeQuotes(exhibitionDetails.EntryDetails)}
                        </h3>
                    </div>
                    <div className="col-start-3 row-start-1 text-right">
                        <h3 className="text-xl tracking-wide font-sans text-gray-600">
                            RSVP Required - {escapeQuotes(exhibitionDetails.RSVPDetails)}
                        </h3>
                    </div>
                </div>
            </div>
        );
    };

    // Local function to render the image carousel
    const renderImageCarousel = () => {
        return (
            <div className="w-full md:w-1/2 relative min-h-[100vh]">
                <div className="absolute inset-0 z-10 overflow-hidden">
                    {images.map((image, index) => (
                        <img
                            key={image.id}
                            src={image.url}
                            alt={`Slide ${index}`}
                            className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                            style={{
                                filter: 'brightness(1.1) contrast(1.2) saturate(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                                objectFit: 'cover'
                            }}
                        />
                    ))}
                    <div className="absolute inset-0 bg-black bg-opacity-30 z-20"></div>
                </div>
            </div>
        );
    };

    return (
        <section
            id="column"
            ref={sectionRef}
            className="relative min-h-screen w-full flex"
        >
            {renderLoadingError()}
            {renderExhibitionDetails()}
            {renderImageCarousel()}
        </section>
    );
};

export default ColumnSection;
