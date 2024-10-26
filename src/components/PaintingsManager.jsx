import { useState } from 'react';
import Swal from 'sweetalert2';

const PaintingsManager = () => {
    const [paintings, setPaintings] = useState(() => {
        // Load paintings from local storage if available
        const savedPaintings = localStorage.getItem('paintings');
        return savedPaintings ? JSON.parse(savedPaintings) : [];
    });
    const [newPainting, setNewPainting] = useState({
        caption: '',
        measurements: '',
        medium: '',
        gallery: '',
        image: null,
    });
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Handle input changes for newPainting
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setNewPainting((prev) => ({
            ...prev,
            [name]: name === 'image' ? files[0] : value,
        }));
    };

    // Save new painting
    const savePainting = async (event) => {
        event.preventDefault();

        // Validate fields
        if (!newPainting.caption || !newPainting.measurements || !newPainting.medium || !newPainting.gallery) {
            setError('All fields except image are required.');
            return;
        }

        try {
            let imageUrl = null;

            // If an image is selected, create a URL
            if (newPainting.image) {
                imageUrl = URL.createObjectURL(newPainting.image);
            }

            // Create new painting object
            const paintingData = {
                ...newPainting,
                src: imageUrl,
                id: Date.now().toString(), // Unique ID based on timestamp
            };

            // Update paintings state and local storage
            const updatedPaintings = [...paintings, paintingData];
            setPaintings(updatedPaintings);
            localStorage.setItem('paintings', JSON.stringify(updatedPaintings));

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
                title: `New painting saved successfully`,
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error('Error saving painting:', error);
            setError('Failed to save painting. Please try again.');
        }
    };

    // Delete painting
    const deletePainting = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this painting?');
        if (!confirmDelete) return;

        // Update paintings state and local storage
        const updatedPaintings = paintings.filter((painting) => painting.id !== id);
        setPaintings(updatedPaintings);
        localStorage.setItem('paintings', JSON.stringify(updatedPaintings));
        setError(null);
    };

    // Pagination logic
    const totalPages = Math.ceil(paintings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPaintings = paintings.slice(startIndex, startIndex + itemsPerPage);

    // Form component
    const PaintingForm = () => (
        <form
            onSubmit={savePainting}
            className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6 mb-6"
        >
            {['caption', 'measurements', 'medium', 'gallery'].map((field) => (
                <div className="flex flex-col" key={field}>
                    <label htmlFor={field} className="text-gray-700 font-semibold mb-1">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                        type="text"
                        name={field}
                        id={field}
                        placeholder={`Enter painting ${field}`}
                        value={newPainting[field]}
                        onChange={handleInputChange}
                        required
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            ))}
            <div className="flex flex-col">
                <label htmlFor="image" className="text-gray-700 font-semibold mb-1">Upload Image</label>
                <input
                    type="file"
                    name="image"
                    id="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="p-3 border border-gray-300 rounded-lg"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none"
            >
                Add Painting
            </button>
        </form>
    );

    // Painting List component - Only show titles
    const PaintingList = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPaintings.map((painting) => (
                <div
                    key={painting.id}
                    className="border border-gray-200 rounded-lg shadow-lg overflow-hidden bg-white p-4 flex flex-col space-y-4"
                >
                    <p className="text-xl font-semibold">{painting.caption}</p>
                    <p className="text-sm text-gray-600">{painting.measurements}</p>
                    <p className="text-sm text-gray-600">{painting.medium}</p>
                    <p className="text-sm text-gray-600">{painting.gallery}</p>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={() => deletePainting(painting.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    // Pagination component
    const Pagination = () => (
        <div className="flex justify-center space-x-4 mt-6">
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    {index + 1}
                </button>
            ))}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Paintings</h2>
            {error && <div className="mb-4 text-red-600">{error}</div>}

            <PaintingForm />

            <h3 className="text-xl font-semibold mb-4">Paintings List</h3>
            {currentPaintings.length > 0 ? <PaintingList /> : <p className="text-gray-500">No paintings available.</p>}

            <Pagination />
        </div>
    );
};

export default PaintingsManager;
