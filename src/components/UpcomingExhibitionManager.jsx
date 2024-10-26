import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

const UpcomingExhibitionManager = () => {
    const [exhibitions, setExhibitions] = useState([]); // Ensure exhibitions is initialized as an empty array
    const [newExhibition, setNewExhibition] = useState({
        title: '',
        date: '',
        quote: '',
        location: { name: '', address: '', city: '' },
    });
    const [editExhibitionId, setEditExhibitionId] = useState(null);
    const [error, setError] = useState(null);

    // Fetch exhibitions from Firestore
    const fetchExhibitions = useCallback(async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "upcoming_exhibitions"));
            const fetchedExhibitions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setExhibitions(fetchedExhibitions);
            setError(null);
        } catch (err) {
            console.error("Error fetching exhibitions:", err);
            setError("Failed to fetch exhibitions. Please try again later.");
        }
    }, []);

    useEffect(() => {
        fetchExhibitions();
    }, [fetchExhibitions]);

    // Handle input changes for newExhibition
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('location.')) {
            const locationField = name.split('.')[1];
            setNewExhibition(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    [locationField]: value,
                },
            }));
        } else {
            setNewExhibition(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Unified function for adding or updating exhibitions
    const handleSaveExhibition = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Validate fields
        if (!newExhibition.title || !newExhibition.date || !newExhibition.quote || !newExhibition.location.name) {
            setError("All fields are required.");
            return;
        }

        try {
            if (editExhibitionId) {
                // Update existing exhibition
                const docRef = doc(db, "upcoming_exhibitions", editExhibitionId);
                await updateDoc(docRef, newExhibition);

                // Update the exhibitions state
                setExhibitions(prev =>
                    prev.map(exhibition => exhibition.id === editExhibitionId ? { ...newExhibition, id: editExhibitionId } : exhibition)
                );

                setEditExhibitionId(null); // Reset edit mode
            } else {
                // Add new exhibition
                const docRef = await addDoc(collection(db, "upcoming_exhibitions"), newExhibition);
                setExhibitions(prev => [...prev, { ...newExhibition, id: docRef.id }]);
            }

            // Reset the form state
            setNewExhibition({
                title: '',
                date: '',
                quote: '',
                location: { name: '', address: '', city: '' },
            });
            setError(null);
        } catch (err) {
            console.error("Error saving exhibition:", err);
            setError("Failed to save exhibition. Please try again.");
        }
    };

    // Prepare exhibition data for editing
    const startEditing = (exhibition) => {
        setNewExhibition({
            title: exhibition.title,
            date: exhibition.date,
            quote: exhibition.quote,
            location: exhibition.location,
        });
        setEditExhibitionId(exhibition.id); // Set the ID of the exhibition being edited
    };

    // Delete exhibition
    const handleDeleteExhibition = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this exhibition?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "upcoming_exhibitions", id));
            // Update exhibitions state to remove the deleted exhibition
            setExhibitions(prev => prev.filter(exhibition => exhibition.id !== id));
            setError(null);
        } catch (err) {
            console.error("Error deleting exhibition:", err);
            setError("Failed to delete exhibition. Please try again.");
        }
    };

    return (
        <div className="p-8 bg-white min-h-screen">
            <h1 className="text-5xl font-thin uppercase text-center mb-12 border-b border-black pb-4">
                Manage Upcoming Exhibitions
            </h1>
            {error && <div className="mb-4 text-red-600">{error}</div>}

            {/* Add/Edit Exhibition Form */}
            <form className="mb-8" onSubmit={handleSaveExhibition}>
                <h2 className="text-2xl mb-4">{editExhibitionId ? "Edit Exhibition" : "Add New Exhibition"}</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Exhibition Title"
                    value={newExhibition.title}
                    onChange={handleChange}
                    className="border p-2 mb-2 w-full"
                    required
                />
                <input
                    type="text"
                    name="date"
                    placeholder="Exhibition Date"
                    value={newExhibition.date}
                    onChange={handleChange}
                    className="border p-2 mb-2 w-full"
                    required
                />
                <input
                    type="text"
                    name="quote"
                    placeholder="Exhibition Quote"
                    value={newExhibition.quote}
                    onChange={handleChange}
                    className="border p-2 mb-2 w-full"
                    required
                />
                <input
                    type="text"
                    name="location.name"
                    placeholder="Location Name"
                    value={newExhibition.location.name}
                    onChange={handleChange}
                    className="border p-2 mb-2 w-full"
                    required
                />
                <input
                    type="text"
                    name="location.address"
                    placeholder="Location Address"
                    value={newExhibition.location.address}
                    onChange={handleChange}
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="text"
                    name="location.city"
                    placeholder="Location City"
                    value={newExhibition.location.city}
                    onChange={handleChange}
                    className="border p-2 mb-2 w-full"
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2"
                >
                    {editExhibitionId ? "Update Exhibition" : "Add Exhibition"}
                </button>
            </form>

            {/* Exhibitions List */}
            <div>
                <h2 className="text-3xl font-thin mb-4">All Upcoming Exhibitions</h2>
                <ul>
                    {exhibitions.length > 0 ? (
                        exhibitions.map((exhibition) => (
                            <li key={exhibition.id} className="border p-4 mb-2 flex justify-between">
                                <span>{exhibition.title} ({exhibition.date})</span>
                                <div>
                                    <button
                                        onClick={() => startEditing(exhibition)}
                                        className="bg-yellow-500 text-white px-4 py-1 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteExhibition(exhibition.id)}
                                        className="bg-red-500 text-white px-4 py-1"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No upcoming exhibitions available.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default UpcomingExhibitionManager;
