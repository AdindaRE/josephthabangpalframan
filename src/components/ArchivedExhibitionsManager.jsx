import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { collection, addDoc, deleteDoc, doc, query, limit, getDocs, startAfter } from 'firebase/firestore';
import { db } from '../firebase-config';

const MAX_EXHIBITIONS = 10;

const Loading = () => <div>Loading...</div>;
const Error = ({ message }) => <div>Error: {message}</div>;
Error.propTypes = { message: PropTypes.string.isRequired };

const ExhibitionForm = ({ newExhibition, handleChange, handleAddExhibition }) => (
    <form onSubmit={handleAddExhibition} className="mb-4">
        <div className="mb-2">
            <label htmlFor="title">Title</label>
            <input
                type="text"
                name="title"
                value={newExhibition.title}
                onChange={handleChange}
                className="border p-2 w-full"
                required
            />
        </div>
        <div className="mb-2">
            <label htmlFor="type">Type</label>
            <select
                name="type"
                value={newExhibition.type}
                onChange={handleChange}
                className="border p-2 w-full"
                required
            >
                <option value="">Select Type</option>
                <option value="Group">Group Exhibition</option>
                <option value="Solo">Solo Exhibition</option>
                <option value="Special">Special Project</option>
            </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">Add Exhibition</button>
    </form>
);

ExhibitionForm.propTypes = {
    newExhibition: PropTypes.shape({
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    handleAddExhibition: PropTypes.func.isRequired,
};

const ExhibitionItem = ({ exhibition, handleDeleteExhibition }) => (
    <li key={exhibition.id} className="mb-2 border p-2">
        <div className="flex justify-between items-center">
            <div>
                <strong>{exhibition.title}</strong> - {exhibition.type}
            </div>
            <button onClick={() => handleDeleteExhibition(exhibition.id)} className="text-red-500">
                Delete
            </button>
        </div>
    </li>
);

ExhibitionItem.propTypes = {
    exhibition: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    }).isRequired,
    handleDeleteExhibition: PropTypes.func.isRequired,
};

const ArchivedExhibitionsManager = () => {
    const [exhibitions, setExhibitions] = useState([]);
    const [newExhibition, setNewExhibition] = useState({ title: '', type: '' });
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchExhibitions = useCallback(async () => {
        setLoading(true);
        try {
            let exhibitionsQuery = query(collection(db, 'exhibitions'), limit(MAX_EXHIBITIONS));
            if (lastVisible) exhibitionsQuery = query(exhibitionsQuery, startAfter(lastVisible));

            const fetchedDocs = await getDocs(exhibitionsQuery);
            const fetchedExhibitions = fetchedDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (fetchedExhibitions.length) {
                setLastVisible(fetchedDocs.docs[fetchedDocs.docs.length - 1]);
            }
            setExhibitions(prev => [...prev, ...fetchedExhibitions]);
            setError(null);
        } catch (err) {
            setError('Failed to fetch exhibitions. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [lastVisible]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewExhibition((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddExhibition = async (event) => {
        event.preventDefault();
        if (!newExhibition.title || !newExhibition.type) {
            setError('All fields are required.');
            return;
        }
        try {
            const docRef = await addDoc(collection(db, 'exhibitions'), newExhibition);
            setExhibitions(prev => [...prev, { ...newExhibition, id: docRef.id }]);
            setNewExhibition({ title: '', type: '' });
        } catch (err) {
            setError('Failed to add exhibition. Please try again.');
            console.error(err);
        }
    };

    const handleDeleteExhibition = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this exhibition?');
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, 'exhibitions', id));
            setExhibitions(prev => prev.filter(ex => ex.id !== id));
        } catch (err) {
            setError('Failed to delete exhibition. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Manage Archived Exhibitions</h2>
            {error && <Error message={error} />}
            <ExhibitionForm
                newExhibition={newExhibition}
                handleChange={handleChange}
                handleAddExhibition={handleAddExhibition}
            />
            <ul>
                {exhibitions.map(exhibition => (
                    <ExhibitionItem
                        key={exhibition.id}
                        exhibition={exhibition}
                        handleDeleteExhibition={handleDeleteExhibition}
                    />
                ))}
            </ul>
            {loading ? <Loading /> : <button onClick={fetchExhibitions} className="mt-4 p-2 bg-gray-300">Load More</button>}
        </div>
    );
};

export default ArchivedExhibitionsManager;
