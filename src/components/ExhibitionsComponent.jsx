import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { collection, getDocs, query, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase-config';

const Loading = () => <div>Loading...</div>;
const Error = ({ message }) => <div>Error: {message}</div>;
Error.propTypes = { message: PropTypes.string.isRequired };

const ExhibitionCategory = ({ title, exhibitions }) => (
    <div>
        <h2 className="text-3xl font-semibold mb-4">{title}</h2>
        <ul>
            {exhibitions.map((exhibition) => (
                <li key={exhibition.id}>
                    <strong>{exhibition.title}</strong> - {exhibition.type}
                </li>
            ))}
        </ul>
    </div>
);

ExhibitionCategory.propTypes = {
    title: PropTypes.string.isRequired,
    exhibitions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
        })
    ).isRequired,
};

const ExhibitionsComponent = () => {
    const [exhibitions, setExhibitions] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const ITEMS_PER_PAGE = 5;

    const fetchExhibitions = useCallback(async () => {
        setLoading(true);
        try {
            let exhibitionsQuery = query(collection(db, "exhibitions"), limit(ITEMS_PER_PAGE));
            if (lastVisible) exhibitionsQuery = query(exhibitionsQuery, startAfter(lastVisible));

            const fetchedDocs = await getDocs(exhibitionsQuery);
            const fetchedExhibitions = fetchedDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (fetchedExhibitions.length) {
                setLastVisible(fetchedDocs.docs[fetchedDocs.docs.length - 1]);
            }

            setExhibitions(prev => [...prev, ...fetchedExhibitions]);
            setError(null);
        } catch (err) {
            console.error("Error fetching exhibitions:", err);
            setError("Error fetching exhibitions. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [lastVisible]);

    useEffect(() => {
        fetchExhibitions();
    }, [fetchExhibitions]);

    const groupExhibitions = exhibitions.filter(ex => ex.type === 'Group');
    const soloExhibitions = exhibitions.filter(ex => ex.type === 'Solo');
    const specialProjects = exhibitions.filter(ex => ex.type === 'Special');

    return (
        <div className="bg-white text-black min-h-screen p-8">
            <h1 className="text-5xl font-thin uppercase text-center mb-12 border-b border-black pb-4">ARCHIVED</h1>
            {error && <Error message={error} />}
            <div className="grid grid-cols-3 gap-8">
                <ExhibitionCategory title="Group Exhibitions" exhibitions={groupExhibitions} />
                <ExhibitionCategory title="Solo Exhibitions" exhibitions={soloExhibitions} />
                <ExhibitionCategory title="Special Projects" exhibitions={specialProjects} />
            </div>
            {loading ? <Loading /> : <button onClick={fetchExhibitions} className="mt-4 p-2 bg-gray-300">Load More</button>}
        </div>
    );
};

export default ExhibitionsComponent;
