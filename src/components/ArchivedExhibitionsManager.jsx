import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase-config';

const MAX_EXHIBITIONS = 10;

/* ExhibitionForm Component */
const ExhibitionForm = ({ newExhibition, handleChange, handleSaveExhibition, editExhibitionId }) => (
    <form className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mb-6" onSubmit={handleSaveExhibition}>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="title">
                Exhibition Title
            </label>
            <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter the title"
                value={newExhibition.title}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="type">
                Type of Exhibition
            </label>
            <input
                type="text"
                id="type"
                name="type"
                placeholder="Enter the exhibition type"
                value={newExhibition.type}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        <div className="flex justify-end">
            <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition ease-in-out duration-150 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
                {editExhibitionId ? 'Update Exhibition' : 'Add Exhibition'}
            </button>
        </div>
    </form>

);

// PropTypes validation for ExhibitionForm
ExhibitionForm.propTypes = {
    newExhibition: PropTypes.shape({
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSaveExhibition: PropTypes.func.isRequired,
    editExhibitionId: PropTypes.string,
};

/* ExhibitionList Component */
const ExhibitionList = ({ exhibitions, handleEditExhibition, handleDeleteExhibition }) => (
    <ul className="max-w-2xl mx-auto">
        {exhibitions.map((exhibition) => (
            <li key={exhibition.id} className="mb-4 p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
                <div>
                    <p className="text-lg font-semibold text-gray-800">{exhibition.title}</p>
                    <p className="text-sm text-gray-500">{exhibition.type}</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEditExhibition(exhibition)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md font-medium hover:bg-yellow-600 transition duration-200 ease-in-out"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteExhibition(exhibition.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition duration-200 ease-in-out"
                    >
                        Delete
                    </button>
                </div>
            </li>
        ))}
    </ul>

);

// PropTypes validation for ExhibitionList
ExhibitionList.propTypes = {
    exhibitions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
        })
    ).isRequired,
    handleEditExhibition: PropTypes.func.isRequired,
    handleDeleteExhibition: PropTypes.func.isRequired,
};

/* Main ArchivedExhibitionsManager Component */
const ArchivedExhibitionsManager = () => {
    const [exhibitions, setExhibitions] = useState([]);
    const [newExhibition, setNewExhibition] = useState({ title: '', type: '' });
    const [editExhibitionId, setEditExhibitionId] = useState(null);
    const [error, setError] = useState(null);

    // Fetch exhibitions from Firestore
    const fetchExhibitions = useCallback(async () => {
        try {
            const exhibitionsCollectionRef = collection(db, 'exhibitions');
            const exhibitionsQuery = query(exhibitionsCollectionRef, limit(MAX_EXHIBITIONS));
            const querySnapshot = await getDocs(exhibitionsQuery);
            const fetchedExhibitions = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setExhibitions(fetchedExhibitions);
            setError(null);
        } catch (err) {
            console.error('Error fetching exhibitions:', err);
            setError('Failed to fetch exhibitions. Please try again later.');
        }
    }, []);

    useEffect(() => {
        fetchExhibitions();
        console.log('Fetching');
    }, [fetchExhibitions]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewExhibition((prev) => ({ ...prev, [name]: value }));
    };

    // Unified function for adding or updating exhibitions
    const handleSaveExhibition = async (event) => {
        event.preventDefault();

        // Validate fields
        if (!newExhibition.title || !newExhibition.type) {
            setError('All fields are required.');
            return;
        }

        try {
            if (editExhibitionId) {
                // Update existing exhibition
                const docRef = doc(db, 'exhibitions', editExhibitionId);
                await updateDoc(docRef, newExhibition);

                setExhibitions((prev) =>
                    prev.map((exhibition) =>
                        exhibition.id === editExhibitionId
                            ? { ...newExhibition, id: editExhibitionId }
                            : exhibition
                    )
                );
                setEditExhibitionId(null); // Reset edit mode
            } else {
                // Add new exhibition
                const docRef = await addDoc(collection(db, 'exhibitions'), newExhibition);
                setExhibitions((prev) => [...prev, { ...newExhibition, id: docRef.id }]);
            }

            resetForm();
        } catch (err) {
            console.error('Error saving exhibition:', err);
            setError('Failed to save exhibition. Please try again.');
        }
    };

    // Reset form and error state
    const resetForm = () => {
        setNewExhibition({ title: '', type: '' });
        setEditExhibitionId(null);
        setError(null);
    };

    // Prepare exhibition data for editing
    const handleEditExhibition = (exhibition) => {
        setNewExhibition({ title: exhibition.title, type: exhibition.type });
        setEditExhibitionId(exhibition.id); // Set the ID of the exhibition being edited
    };

    // Delete exhibition
    const handleDeleteExhibition = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this exhibition?');
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, 'exhibitions', id));
            setExhibitions((prev) => prev.filter((exhibition) => exhibition.id !== id));
            setError(null);
        } catch (err) {
            console.error('Error deleting exhibition:', err);
            setError('Failed to delete exhibition. Please try again.');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Manage Archived Exhibitions</h2>
            {error && <div className="mb-4 text-red-600">{error}</div>}

            <ExhibitionForm
                newExhibition={newExhibition}
                handleChange={handleChange}
                handleSaveExhibition={handleSaveExhibition}
                editExhibitionId={editExhibitionId}
            />

            <h3 className="text-xl font-semibold mb-4">Existing Exhibitions</h3>

            <ExhibitionList
                exhibitions={exhibitions}
                handleEditExhibition={handleEditExhibition}
                handleDeleteExhibition={handleDeleteExhibition}
            />
        </div>
    );
};

export default ArchivedExhibitionsManager;
