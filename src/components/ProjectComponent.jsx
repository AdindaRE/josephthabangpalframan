import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

// ProjectCard Component
const ProjectCard = ({ project }) => (
    <div className="relative w-full mb-8">
        <Link to={project.link} className="block cursor-pointer">
            <img
                src={project.image}
                alt={`Project ${project.id}`}
                className="object-cover w-full h-auto transition-transform duration-300 hover:scale-105"
                style={{ height: 'auto', maxHeight: '80vh' }}
            />
        </Link>
        <div className="text-left mt-2 text-sm text-gray-500 z-20" style={{ width: '100%' }}>
            {project.caption}
        </div>
    </div>
);

// Prop validation for ProjectCard component
ProjectCard.propTypes = {
    project: PropTypes.shape({
        id: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        caption: PropTypes.string.isRequired,
    }).isRequired,
};

// ProjectComponent
const ProjectComponent = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch projects from Firestore
    const fetchProjects = useCallback(async () => {
        try {
            const projectsCollectionRef = collection(db, 'projects');
            const projectDocs = await getDocs(projectsCollectionRef);
            const projectList = projectDocs.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProjects(projectList);
        } catch (err) {
            console.error("Error fetching projects:", err);
            setError("Error fetching projects. Please try again later.");
        } finally {
            setLoading(false); // Set loading to false once fetching is done
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Handle loading state
    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    // Handle error state
    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <section id="projects" className="relative bg-white flex flex-col items-center mt-32 mb-32">
            <h1 className="w-[calc(40%-2rem)] text-center text-6xl font-light text-black bg-transparent opacity-90 py-8 z-20">
                Featured Projects
            </h1>

            <div className="flex flex-col items-start w-[calc(40%-2rem)] mx-auto">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
};

export default ProjectComponent;
