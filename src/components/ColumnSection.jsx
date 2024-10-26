import { useEffect, useState, useRef, useCallback } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase-config'; // Ensure this points to your Firebase config

const ColumnSection = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [exhibitionDetails, setExhibitionDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const sectionRef = useRef(null); // Create a ref for the section element

    const images = [
        'public/assets/images/hero/casco - zwaar - jw (web res)-42.JPEG',
        'public/assets/images/GalleryImageeditready.jpg',
    ];

    // Function to go to the next slide
    const nextSlide = useCallback(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, [images.length]);

    useEffect(() => {
        // Autoplay functionality
        const autoplay = setInterval(nextSlide, 3000); // Change image every 3 seconds

        return () => clearInterval(autoplay); // Cleanup on unmount
    }, [nextSlide]);

    // Caching fetched data
    const [cachedExhibitionDetails, setCachedExhibitionDetails] = useState(null);

    // Fetch upcoming exhibition details from Firestore with a limit
    const fetchExhibitionDetails = useCallback(async () => {
        // Check if we have cached data
        if (cachedExhibitionDetails) {
            setExhibitionDetails(cachedExhibitionDetails);
            setLoading(false);
            return;
        }

        setLoading(true); // Set loading state to true
        try {
            const exhibitionsCollectionRef = collection(db, "upcoming_exhibitions");
            const exhibitionsQuery = query(exhibitionsCollectionRef, limit(1)); // Limit to 1 document
            const querySnapshot = await getDocs(exhibitionsQuery);
            const exhibitionData = [];

            querySnapshot.forEach((doc) => {
                exhibitionData.push({ id: doc.id, ...doc.data() });
            });

            if (exhibitionData.length > 0) {
                const exhibition = exhibitionData[0]; // Get the first exhibition for display
                setExhibitionDetails(exhibition);
                setCachedExhibitionDetails(exhibition); // Cache the fetched exhibition details
            } else {
                setError("No upcoming exhibitions found.");
            }
        } catch (err) {
            console.error("Error fetching exhibition details:", err);
            setError("Error fetching exhibition details. Please try again later.");
        } finally {
            setLoading(false); // Set loading state to false
        }
    }, [cachedExhibitionDetails]);

    // Fetch exhibition details only once when component mounts
    useEffect(() => {
        fetchExhibitionDetails(); // Call the fetch function once
    }, [fetchExhibitionDetails]);

    // Handle error state
    if (error) {
        return <div className="text-red-500">{error}</div>; // Display error message
    }

    // Loading state
    if (loading) {
        return <div>Loading...</div>; // Display loading state
    }

    // Escape quotes in the exhibition details
    const escapeQuotes = (str) => {
        return str.replace(/"/g, '&quot;');
    };

    return (
        <section
            id="column"
            ref={sectionRef}
            className="relative min-h-screen w-full flex"
        >
            {/* Left Column: Exhibition details */}
            <div className="w-full md:w-1/2 bg-white relative min-h-[100vh] p-8">
                {/* Full Grid Layout */}
                <div className="grid grid-cols-3 grid-rows-3 gap-6 w-full h-full relative">
                    {/* Date - Top Left */}
                    <div className="col-start-1 row-start-1 self-end">
                        <h2 className="text-4xl md:text-5xl font-light uppercase tracking-tight font-open-sans leading-tight">
                            {escapeQuotes(exhibitionDetails.date)}
                        </h2>
                    </div>

                    {/* Quote - Centered on Second Row */}
                    <div className="col-start-2 row-start-2 self-center justify-self-center">
                        <h2 className="text-xl leading-[1.2em] tracking-[0.8px] text-black font-sans text-center">
                            &quot;{escapeQuotes(exhibitionDetails.quote)}&quot;
                        </h2>
                    </div>

                    {/* Location - Bottom Right */}
                    <div className="col-start-3 row-start-3 self-end text-right">
                        <p className="text-xl leading-[1.2em] tracking-[0.8px] text-black font-sans">
                            {escapeQuotes(exhibitionDetails.location.name)}<br />
                            {escapeQuotes(exhibitionDetails.location.address)}<br />
                            {escapeQuotes(exhibitionDetails.location.city)}
                        </p>
                    </div>

                    {/* Additional Exhibition Details */}
                    <div className="col-start-1 row-start-2">
                        <h3 className="text-xl tracking-wide font-sans text-gray-600">
                            Free Entry - {escapeQuotes(exhibitionDetails.title)}
                        </h3>
                    </div>

                    <div className="col-start-3 row-start-1 text-right">
                        <h3 className="text-xl tracking-wide font-sans text-gray-600">
                            RSVP Required
                        </h3>
                    </div>
                </div>
            </div>

            {/* Right Column: Full-screen carousel */}
            <div className="w-full md:w-1/2 relative min-h-[100vh]">
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
                    <div className="absolute inset-0 bg-black bg-opacity-30 z-20"></div>
                </div>
            </div>
        </section>
    );
};

export default ColumnSection;
