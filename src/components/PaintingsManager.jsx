import { useState, useCallback, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase-config'; // Import Firestore and Storage
import Swal from 'sweetalert2';

/* Add new painting form */
const FormDataComponent = ({ savePainting, newPainting, handleInputChange }) => (
    <form
        onSubmit={savePainting}
        className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6"
    >
        {/* Caption Input */}
        <div className="flex flex-col">
            <label htmlFor="caption" className="text-gray-700 font-semibold mb-1">Caption</label>
            <input
                type="text"
                name="caption"
                id="caption"
                placeholder="Enter painting caption"
                value={newPainting?.caption}
                onChange={handleInputChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* Measurements Input */}
        <div className="flex flex-col">
            <label htmlFor="measurements" className="text-gray-700 font-semibold mb-1">Measurements</label>
            <input
                type="text"
                name="measurements"
                id="measurements"
                placeholder="Enter painting measurements"
                value={newPainting?.measurements}
                onChange={handleInputChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* Medium Input */}
        <div className="flex flex-col">
            <label htmlFor="medium" className="text-gray-700 font-semibold mb-1">Medium</label>
            <input
                type="text"
                name="medium"
                id="medium"
                placeholder="Enter painting medium"
                value={newPainting?.medium}
                onChange={handleInputChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* Gallery Input */}
        <div className="flex flex-col">
            <label htmlFor="gallery" className="text-gray-700 font-semibold mb-1">Gallery</label>
            <input
                type="text"
                name="gallery"
                id="gallery"
                placeholder="Enter gallery name"
                value={newPainting?.gallery}
                onChange={handleInputChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col">
            <label htmlFor="image" className="text-gray-700 font-semibold mb-1">Upload Image</label>
            <input
                type="file"
                name="image"
                id="image"
                onChange={handleInputChange}
                accept="image/*"
                className="p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
        </div>

        {/* Submit Button */}
        <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        >
            {newPainting?.id ? 'Update Painting' : 'Add Painting'}
        </button>
    </form>
);

// PropTypes validation for FormDataComponent
FormDataComponent.propTypes = {
    savePainting: PropTypes.func.isRequired,
    newPainting: PropTypes.shape({
        caption: PropTypes.string,
        measurements: PropTypes.string,
        medium: PropTypes.string,
        gallery: PropTypes.string,
        image: PropTypes.any,
        id: PropTypes.string,
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired,
};

/* List of paintings */
const ListPaintingsComponent = ({ paintings, setNewPainting, deletePainting }) => (
    <div className="max-w-7xl mx-auto p-6">
        <h3 className="text-2xl font-semibold mb-6">Paintings List</h3>

        {paintings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paintings.map((painting) => (
                    <div
                        key={painting.id}
                        className="border border-gray-200 rounded-lg shadow-lg overflow-hidden bg-white p-4 flex flex-col space-y-4"
                    >
                        <img
                            src={painting.src}
                            alt={painting.caption}
                            className="w-full h-64 object-cover rounded-md"
                        />

                        <div className="space-y-2">
                            <p className="text-xl font-semibold">{painting.caption}</p>
                            <p className="text-sm text-gray-600">{painting.measurements}</p>
                            <p className="text-sm text-gray-600">{painting.medium}</p>
                            <p className="text-sm text-gray-600">{painting.gallery}</p>
                        </div>

                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => setNewPainting(painting)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deletePainting(painting.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500">No paintings available.</p>
        )}
    </div>

);

// PropTypes validation for ListPaintingsComponent
ListPaintingsComponent.propTypes = {
    paintings: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            caption: PropTypes.string.isRequired,
            measurements: PropTypes.string.isRequired,
            medium: PropTypes.string.isRequired,
            gallery: PropTypes.string.isRequired,
            src: PropTypes.string,
        })
    ).isRequired,
    setNewPainting: PropTypes.func.isRequired,
    deletePainting: PropTypes.func.isRequired,
};

function PaintingsManager() {
    const [paintings, setPaintings] = useState([]); // Ensure paintings is an array
    const [newPainting, setNewPainting] = useState({
        caption: '',
        measurements: '',
        medium: '',
        gallery: '',
        image: null,
    });
    const [error, setError] = useState(null);

    // Fetch paintings from Firestore
    const fetchPaintings = useCallback(async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'paintings'));
            const paintingsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPaintings(paintingsData); // Ensure it's set as an array
            setError(null);
        } catch (err) {
            console.error('Error fetching paintings:', err);
            setError('Failed to fetch paintings. Please try again later.');
        }
    }, []);

    // Correctly call fetchPaintings inside useLayoutEffect
    useLayoutEffect(() => {
        fetchPaintings(); // Invoke fetchPaintings
        console.log('Fetching');
    }, [fetchPaintings]);


    // Handle input changes for newPainting
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setNewPainting((prev) => ({
            ...prev,
            [name]: name === 'image' ? files[0] : value,
        }));
    };

    // Unified function for adding or updating painting
    const savePainting = async (event) => {
        event.preventDefault(); // Prevent form submission

        // Validate fields
        if (!newPainting.caption || !newPainting.measurements || !newPainting.medium || !newPainting.gallery) {
            setError('All fields except image are required.');
            return;
        }

        try {
            let imageUrl = null;

            // If an image is selected, upload it to Firebase Storage
            if (newPainting.image) {
                const imageRef = ref(storage, `paintings/${newPainting.image.name}`);
                const uploadResult = await uploadBytes(imageRef, newPainting.image);
                imageUrl = await getDownloadURL(uploadResult.ref); // Get the image URL after upload
            }

            if (newPainting.id) {
                // If editing an existing painting
                const paintingRef = doc(db, 'paintings', newPainting.id);
                await updateDoc(paintingRef, {
                    caption: newPainting.caption,
                    measurements: newPainting.measurements,
                    medium: newPainting.medium,
                    gallery: newPainting.gallery,
                    ...(imageUrl && { src: imageUrl }), // Only update the image URL if a new image was uploaded
                });

                // Update the paintings state
                setPaintings((prev) =>
                    prev.map((painting) =>
                        painting.id === newPainting.id
                            ? { ...newPainting, src: imageUrl || painting.src, id: painting.id }
                            : painting
                    )
                );
            } else {
                // Adding a new painting
                const docRef = await addDoc(collection(db, 'paintings'), {
                    caption: newPainting.caption,
                    measurements: newPainting.measurements,
                    medium: newPainting.medium,
                    gallery: newPainting.gallery,
                    src: imageUrl, // Store the image URL in Firestore
                });

                // Update the paintings state with the new painting
                setPaintings((prev) => [...prev, { ...newPainting, src: imageUrl, id: docRef.id }]);
            }

            // Reset newPainting state
            setNewPainting({
                caption: '',
                measurements: '',
                medium: '',
                gallery: '',
                image: null,
            });
            setError(null);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `New painting is saved successfully`,
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error('Error saving painting:', error);
            setError('Failed to save painting. Please try again.');
        }
    };

    // Delete painting from Firestore
    const deletePainting = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this painting?');
        if (!confirmDelete) return;

        try {
            // Deleting the painting document from Firestore
            await deleteDoc(doc(db, 'paintings', id));
            console.log('Deleted painting with id:', id);

            // Update the paintings state to remove the deleted painting
            setPaintings((prev) => prev.filter((painting) => painting.id !== id));

            setError(null);
        } catch (error) {
            console.error('Error deleting painting:', error);
            setError('Failed to delete painting. Please try again.');
        }
    };

    return (
        <div>
            <h2>Manage Paintings</h2>
            {error && <div className="mb-4 text-red-600">{error}</div>}

            <FormDataComponent
                handleInputChange={handleInputChange}
                newPainting={newPainting}
                savePainting={savePainting}
            />

            <ListPaintingsComponent
                paintings={paintings}
                setNewPainting={setNewPainting}
                deletePainting={deletePainting}
            />
        </div>
    );
}

export default PaintingsManager;
