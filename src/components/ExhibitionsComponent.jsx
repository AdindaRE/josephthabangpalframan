import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

// ExhibitionCard Component
const ExhibitionCard = ({ title }) => (
    <div className="relative p-6 border-b border-gray-300">
        <h3 className="text-xl font-thin">{title}</h3>
    </div>
);

// Prop validation for ExhibitionCard component
ExhibitionCard.propTypes = {
    title: PropTypes.string.isRequired,
};

// ExhibitionCategory Component
const ExhibitionCategory = ({ title, exhibitions }) => (
    <div>
        <h2 className="text-4xl font-thin uppercase mb-8 border-b border-black pb-4">{title}</h2>
        {exhibitions.map(item => (
            <ExhibitionCard key={item.id} title={item.title} />
        ))}
    </div>
);

// Prop validation for ExhibitionCategory component
ExhibitionCategory.propTypes = {
    title: PropTypes.string.isRequired,
    exhibitions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        })
    ).isRequired,
};

// Loading Component
const Loading = () => (
    <div>Loading...</div>
);

// Error Component
const Error = ({ message }) => (
    <div className="text-red-500">{message}</div>
);

// Prop validation for Error component
Error.propTypes = {
    message: PropTypes.string.isRequired,
};

const ExhibitionsComponent = () => {
    const [exhibitions, setExhibitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch exhibitions from Firestore
    const fetchExhibitions = async () => {
        setLoading(true);
        try {
            const fetchedDocs = await getDocs(collection(db, "exhibitions"));
            const fetchedExhibitions = fetchedDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Fetched Exhibitions:", fetchedExhibitions); // Debugging output
            setExhibitions(fetchedExhibitions);
        } catch (err) {
            console.error("Error fetching exhibitions:", err);
            setError("Error fetching exhibitions. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExhibitions();
    }, []);

    // Filter exhibitions by type
    const groupExhibitions = exhibitions.filter(ex => ex.type === 'Group');
    const soloExhibitions = exhibitions.filter(ex => ex.type === 'Solo');
    const specialProjects = exhibitions.filter(ex => ex.type === 'Special');

    // Debugging output for filtered exhibitions
    console.log("Group Exhibitions:", groupExhibitions);
    console.log("Solo Exhibitions:", soloExhibitions);
    console.log("Special Projects:", specialProjects);

    // Handle loading state
    if (loading) {
        return <Loading />;
    }

    // Handle error state
    if (error) {
        return <Error message={error} />;
    }

    return (
        <div className="bg-white text-black min-h-screen p-8">
            <h1 className="text-5xl font-thin uppercase text-center mb-12 border-b border-black pb-4">ARCHIVED</h1>
            <div className="grid grid-cols-3 gap-8">
                {/* Group Exhibitions */}
                <ExhibitionCategory title="Group Exhibitions" exhibitions={groupExhibitions} />

                {/* Solo Exhibitions */}
                <ExhibitionCategory title="Solo Exhibitions" exhibitions={soloExhibitions} />

                {/* Special Projects */}
                <ExhibitionCategory title="Special Projects" exhibitions={specialProjects} />
            </div>
        </div>
    );
};

export default ExhibitionsComponent;
