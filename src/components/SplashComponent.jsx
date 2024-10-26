import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

// VideoBackground Component
const VideoBackground = ({ videoSrc }) => {
    const videoRef = useRef(null);

    // Set playback rate and manually trigger play when videoSrc changes
    useEffect(() => {
        if (videoRef.current && videoSrc) {
            videoRef.current.playbackRate = 1; // Set a default playback rate
            videoRef.current.play(); // Manually trigger playback
        }
    }, [videoSrc]);

    return videoSrc ? (
        <video
            ref={videoRef}
            className="absolute inset-0 object-cover w-full h-full transition-transform duration-300"
            src={videoSrc}
            autoPlay
            loop
            muted
            preload="auto"
            style={{
                objectFit: 'cover',
                filter: 'brightness(1.1) contrast(1.2) saturate(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
        />
    ) : (
        <div className="flex justify-center items-center h-full">
            <h2 className="text-white">No video available</h2>
        </div>
    );
};

// Prop validation for VideoBackground component
VideoBackground.propTypes = {
    videoSrc: PropTypes.string,
};

// Header Component
const Header = () => (
    <div className="relative flex flex-col items-center justify-center p-6 md:p-12 space-y-6">
        <Link to="/home">
            <h1 className="text-5xl md:text-5xl font-light mb-4 leading-[1.2em] text-white tracking-[-1px] tracking-wider font-open-sans relative cursor-pointer transition-opacity duration-700 ease-in-out hover:opacity-60">
                Joseph Thabang Palframan Studios ©
            </h1>
        </Link>
    </div>
);

// Main SplashComponent
const SplashComponent = () => {
    const [videoData, setVideoData] = useState(null);
    const sectionRef = useRef(null);

    // Fetch video data from Firestore on mount
    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const videoCollectionRef = collection(db, 'videos');
                const videoDocs = await getDocs(videoCollectionRef);
                const videos = videoDocs.docs.map(doc => ({ ...doc.data(), id: doc.id }));

                console.log("Fetched videos:", videos);
                setVideoData(videos.length > 0 ? videos[0] : null); // Set the first video found, or null if none exists

                // Log the first video fetched, for debugging purposes
                if (videos.length > 0) {
                    console.log("First video data:", videos[0]);
                }
            } catch (error) {
                console.error("Error fetching video data:", error);
            }
        };

        fetchVideoData(); // Fetch video data when the component mounts
    }, []);

    return (
        <section
            id="hero"
            ref={sectionRef}
            className="relative min-h-screen w-full text-[#010358] px-4 md:px-8 py-16 md:py-20 flex items-center justify-center overflow-hidden z-20"
        >
            <div className="absolute inset-0 z-10 overflow-hidden">
                {/* Video background rendering logic */}
                {videoData && videoData.src ? (
                    <VideoBackground videoSrc={videoData.src} />
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <h2 className="text-white">No video available</h2>
                    </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 z-20"></div>
            </div>

            <div className="relative container mx-auto text-center z-30">
                {/* Render the header content */}
                <Header />
            </div>
        </section>
    );
};

export default SplashComponent;
