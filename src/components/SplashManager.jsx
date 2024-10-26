import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { db } from '../firebase-config';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/* Video Display Component */
const VideoDisplay = ({ video, handleVideoOperation, isDeleting }) => (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-lg mb-4">Video Source: <span className="font-medium">{video.src}</span></p>
        <div className="flex justify-end">
            <button
                onClick={() => handleVideoOperation('delete')}
                disabled={isDeleting}
                className={`bg-red-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600 focus:ring-2 focus:ring-red-500 transition ease-in-out duration-150 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Delete Video
            </button>
        </div>
    </div>
);

// PropTypes validation for VideoDisplay component
VideoDisplay.propTypes = {
    video: PropTypes.shape({
        src: PropTypes.string.isRequired,
    }).isRequired,
    handleVideoOperation: PropTypes.func.isRequired,
    isDeleting: PropTypes.bool.isRequired,
};

/* Video Upload Component */
const VideoUpload = ({ videoFile, setVideoFile, handleVideoOperation }) => (
    <div>
        <h3 className="mb-4">Upload a Video</h3>
        <input
            type="file"
            accept="video/mp4"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="border p-2 mr-2 w-full"
        />
        <button
            onClick={() => handleVideoOperation('add')}
            disabled={!videoFile}
            className={`bg-blue-500 text-white px-4 py-2 ${!videoFile ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            Add Video
        </button>
    </div>
);

// PropTypes validation for VideoUpload component
VideoUpload.propTypes = {
    videoFile: PropTypes.any,
    setVideoFile: PropTypes.func.isRequired,
    handleVideoOperation: PropTypes.func.isRequired,
};

/* Main SplashManager Component */
const SplashManager = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [video, setVideo] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState('');

    const storage = getStorage();

    // Fetch videos from Firestore or Local Storage
    const fetchVideos = useCallback(async () => {
        const cachedVideo = localStorage.getItem('splashVideo');
        if (cachedVideo) {
            setVideo(JSON.parse(cachedVideo));
            return;
        }

        const videosCollectionRef = collection(db, 'videos');
        const videoDocs = await getDocs(videosCollectionRef);
        const videos = videoDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        if (videos.length > 0) {
            setVideo(videos[0]); // Set the first video
            localStorage.setItem('splashVideo', JSON.stringify(videos[0])); // Cache video
        } else {
            setVideo(null);
        }
    }, []);

    useEffect(() => {
        fetchVideos(); // Fetch videos on component mount
    }, [fetchVideos]);

    // Handle video operations (add, delete)
    const handleVideoOperation = async (operation) => {
        const videosCollectionRef = collection(db, 'videos');

        try {
            if (operation === 'add' && videoFile) {
                const storageRef = ref(storage, `videos/${videoFile.name}`);
                await uploadBytes(storageRef, videoFile);
                const url = await getDownloadURL(storageRef);

                const videoData = { src: url }; // Store video source URL
                await addDoc(videosCollectionRef, videoData);
                setMessage("Video added successfully!");
                setVideoFile(null); // Reset file input
                localStorage.removeItem('splashVideo'); // Clear cache on new upload
            } else if (operation === 'delete' && video) {
                const confirmDelete = window.confirm("Are you sure you want to delete the current video?");
                if (!confirmDelete) return;

                setIsDeleting(true);
                const videoDoc = doc(db, 'videos', video.id);
                await deleteDoc(videoDoc);
                setMessage("Video deleted successfully!");
                localStorage.removeItem('splashVideo'); // Clear cache on deletion
                setVideo(null); // Reset video state
            }
        } catch (error) {
            console.error(`Error during ${operation}:`, error);
            setMessage(`Error during ${operation}: ${error.message}`);
        } finally {
            if (operation === 'delete') {
                setIsDeleting(false);
            }
            await fetchVideos(); // Refresh state after operation
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Manage Splash Video</h2>
            {message && <div className="mb-4 text-green-600">{message}</div>}

            {video ? (
                <VideoDisplay
                    video={video}
                    handleVideoOperation={handleVideoOperation}
                    isDeleting={isDeleting}
                />
            ) : (
                <VideoUpload
                    videoFile={videoFile}
                    setVideoFile={setVideoFile}
                    handleVideoOperation={handleVideoOperation}
                />
            )}
        </div>
    );
};

export default SplashManager;
