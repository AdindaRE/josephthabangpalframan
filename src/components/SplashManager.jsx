import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { db } from '../firebase-config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/* Video Display Component */
const VideoDisplay = ({ video, playbackRate, setPlaybackRate, handleVideoOperation, isDeleting }) => (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Current Video:</h3>

        <div className="mb-6">
            <iframe
                width="100%"
                height="315"
                src={video.src}
                title="Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-sm"
            />
        </div>

        <p className="text-lg mb-4">
            Playback Rate: <span className="font-medium">{video.playbackRate}</span>
        </p>

        <div className="mb-6 flex items-center space-x-4">
            <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="Playback Rate"
                value={playbackRate}
                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
                onClick={() => handleVideoOperation('update')}
                disabled={isDeleting}
                className={`flex-shrink-0 bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-150 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                Update Playback Rate
            </button>
        </div>

        <div className="flex justify-end">
            <button
                onClick={() => handleVideoOperation('delete')}
                disabled={isDeleting}
                className={`bg-red-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600 focus:ring-2 focus:ring-red-500 transition ease-in-out duration-150 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
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
        playbackRate: PropTypes.number.isRequired,
    }),
    playbackRate: PropTypes.number.isRequired,
    setPlaybackRate: PropTypes.func.isRequired,
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
    const [playbackRate, setPlaybackRate] = useState(1.1);
    const [video, setVideo] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState('');

    const storage = getStorage();

    // Fetch videos from Firestore
    const fetchVideos = useCallback(async () => {
        const videosCollectionRef = collection(db, 'videos');
        const videoDocs = await getDocs(videosCollectionRef);
        const videos = videoDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setVideo(videos.length > 0 ? videos[0] : null); // Set the first video, or null if none exist
    }, []);

    useEffect(() => {
        fetchVideos(); // Fetch videos on component mount
    }, [fetchVideos]);

    // Handle video operations (add, update, delete)
    const handleVideoOperation = async (operation) => {
        const videosCollectionRef = collection(db, 'videos');

        try {
            if (operation === 'add' && videoFile) {
                const storageRef = ref(storage, `videos/${videoFile.name}`);
                await uploadBytes(storageRef, videoFile);
                const url = await getDownloadURL(storageRef);

                const videoData = { src: url, playbackRate };
                await addDoc(videosCollectionRef, videoData);
                setMessage("Video added successfully!");
                setVideoFile(null); // Reset file input
            } else if (operation === 'update' && video) {
                const videoDoc = doc(db, 'videos', video.id);
                await updateDoc(videoDoc, { playbackRate });
                setMessage("Playback rate updated successfully!");
            } else if (operation === 'delete' && video) {
                const confirmDelete = window.confirm("Are you sure you want to delete the current video?");
                if (!confirmDelete) return;

                setIsDeleting(true);
                const videoDoc = doc(db, 'videos', video.id);
                await deleteDoc(videoDoc);
                setMessage("Video deleted successfully!");
            }
        } catch (error) {
            console.error(`Error during ${operation}:`, error);
            setMessage(`Error during ${operation}: ${error.message}`);
        } finally {
            await fetchVideos(); // Re-fetch videos after each operation
            if (operation === 'delete') setIsDeleting(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Manage Splash Video</h2>

            {message && <div className="mb-4 text-green-600">{message}</div>}

            {video ? (
                <VideoDisplay
                    video={video}
                    playbackRate={playbackRate}
                    setPlaybackRate={setPlaybackRate}
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
