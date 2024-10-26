import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

const ExhibitionImageCarouselManager = () => {
    const [images, setImages] = useState([]);

    const fetchImages = async () => {
        try {
            const imagesCollectionRef = collection(db, 'exhibition_images');
            const imagesSnapshot = await getDocs(imagesCollectionRef);
            const imagesData = imagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setImages(imagesData);
        } catch (error) {
            console.error("Error fetching images: ", error);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleDeleteImage = async (imageId) => {
        try {
            const imageDocRef = collection(db, 'exhibition_images').doc(imageId);
            await deleteDoc(imageDocRef);
            console.log(`Deleted image with ID: ${imageId}`);
            fetchImages(); // Re-fetch the images after deletion
        } catch (error) {
            console.error("Error deleting image: ", error);
        }
    };

    return (
        <div>
            <h2>Image Carousel Manager</h2>
            <ul>
                {images.map((image) => (
                    <li key={image.id}>
                        <img src={image.url} alt={image.alt} />
                        <button onClick={() => handleDeleteImage(image.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExhibitionImageCarouselManager;
