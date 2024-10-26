import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Import the Firestore database
import { collection, getDocs } from 'firebase/firestore';

const ProjectDetailsComponent = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch projects from Firestore
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'projects'));
                const fetchedProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProjects(fetchedProjects);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setError('Failed to load projects. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Loader
    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    // Error handling
    if (error) {
        return <div className="text-red-600 text-center py-20">{error}</div>;
    }

    // Render project details
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Project Details</h1>
            {projects.map((project) => (
                <div key={project.id} className="mb-8 border-b pb-4">
                    <h2 className="text-2xl font-semibold">{project.title}</h2>
                    <p className="text-gray-600">Date: {project.date}</p>
                    <img src={project.mainImage} alt={project.title} className="mt-2 rounded shadow" />
                    <p className="mt-2">{project.description}</p>
                    <a href={project.video} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                        Watch Video
                    </a>
                    {project.additionalImages.length > 0 && (
                        <div>
                            <h3 className="mt-4 font-semibold">Additional Images:</h3>
                            <div className="flex">
                                {project.additionalImages.map((img, index) => (
                                    <img key={index} src={img} alt={`Additional ${index}`} className="w-24 h-24 mr-2 rounded" />
                                ))}
                            </div>
                        </div>
                    )}
                    {project.researchImages.length > 0 && (
                        <div>
                            <h3 className="mt-4 font-semibold">Research Images:</h3>
                            <div className="flex">
                                {project.researchImages.map((img, index) => (
                                    <img key={index} src={img} alt={`Research ${index}`} className="w-24 h-24 mr-2 rounded" />
                                ))}
                            </div>
                        </div>
                    )}
                    <div>
                        <h3 className="mt-4 font-semibold">About:</h3>
                        <ul className="list-disc pl-5">
                            {project.about.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="mt-4 font-semibold">Partners:</h3>
                        <ul className="list-disc pl-5">
                            {project.partners.map((partner, index) => (
                                <li key={index}>{partner}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="mt-4 font-semibold">References:</h3>
                        <ul className="list-disc pl-5">
                            {project.references.map((reference, index) => (
                                <li key={index}>{reference}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectDetailsComponent;
