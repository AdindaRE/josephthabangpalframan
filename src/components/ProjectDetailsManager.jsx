import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { db } from '../firebase-config';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore'; // Import necessary Firestore methods

const ProjectDetailsManager = () => {
    const [projects, setProjects] = useState(() => {
        const savedProjects = localStorage.getItem('projects');
        return savedProjects ? JSON.parse(savedProjects) : [];
    });
    const [newProject, setNewProject] = useState({
        title: '',
        date: '',
        mainImage: '',
        description: '',
        video: '',
        additionalImages: '',
        researchImages: '',
        icon: '',
        about: '',
        partners: '',
        references: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch existing projects on component mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'projects'));
                const fetchedProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProjects(fetchedProjects);
                localStorage.setItem('projects', JSON.stringify(fetchedProjects)); // Update local storage
            } catch (error) {
                console.error('Error fetching projects:', error);
                setError('Failed to load projects. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Handle input changes for newProject
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Save new project
    const saveProject = async (event) => {
        event.preventDefault();
        const { title, date, mainImage, description, video } = newProject;

        // Validate required fields
        if (!title || !date || !mainImage || !description || !video) {
            setError('Title, Date, Main Image, Description, and Video fields are required.');
            return;
        }

        try {
            // Convert string inputs to appropriate data types
            const projectData = {
                ...newProject,
                additionalImages: newProject.additionalImages.split(',').map(img => img.trim()), // Convert to array
                researchImages: JSON.parse(newProject.researchImages || '[]'), // Convert from JSON
                about: newProject.about.split(',').map(item => item.trim()), // Convert to array
                partners: newProject.partners.split(',').map(item => item.trim()), // Convert to array
                references: JSON.parse(newProject.references || '[]'), // Convert from JSON
            };

            const docRef = await addDoc(collection(db, 'projects'), projectData);
            const updatedProject = { id: docRef.id, ...projectData };
            const updatedProjects = [...projects, updatedProject];
            setProjects(updatedProjects);
            localStorage.setItem('projects', JSON.stringify(updatedProjects)); // Update local storage
            resetForm(); // Reset form after submission

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'New project saved successfully',
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error('Error saving project:', error);
            setError('Failed to save project. Please try again.');
        }
    };

    // Delete project
    const deleteProject = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this project?');
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, 'projects', id));
            const updatedProjects = projects.filter((project) => project.id !== id);
            setProjects(updatedProjects);
            localStorage.setItem('projects', JSON.stringify(updatedProjects)); // Update local storage
        } catch (error) {
            console.error('Error deleting project:', error);
            setError('Failed to delete project. Please try again.');
        }
    };

    // Reset form state
    const resetForm = () => {
        setNewProject({
            title: '',
            date: '',
            mainImage: '',
            description: '',
            video: '',
            additionalImages: '',
            researchImages: '',
            icon: '',
            about: '',
            partners: '',
            references: '',
        });
        setError(null);
    };

    // Loader
    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    // Form component
    const ProjectForm = () => (
        <form onSubmit={saveProject} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Add New Project</h2>
            {['title', 'date', 'mainImage', 'description', 'video'].map((field) => (
                <div className="flex flex-col" key={field}>
                    <label htmlFor={field} className="text-gray-700 font-semibold mb-1">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                        type="text"
                        name={field}
                        id={field}
                        placeholder={`Enter project ${field}`}
                        value={newProject[field]}
                        onChange={handleInputChange}
                        required
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    />
                </div>
            ))}
            {['additionalImages', 'researchImages', 'icon', 'about', 'partners', 'references'].map((field) => (
                <div className="flex flex-col" key={field}>
                    <label htmlFor={field} className="text-gray-700 font-semibold mb-1">
                        {field.charAt(0).toUpperCase() + field.slice(1)} (optional)
                    </label>
                    <textarea
                        name={field}
                        id={field}
                        placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                        value={newProject[field]}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    />
                </div>
            ))}
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600 focus:outline-none"
            >
                Add Project
            </button>
            {error && <div className="text-red-600 mt-2">{error}</div>}
        </form>
    );

    // Project List component
    const ProjectList = () => (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Existing Projects</h2>
            <ul className="list-disc pl-5">
                {projects.map((project) => (
                    <li key={project.id} className="flex justify-between items-center mb-2">
                        <div>
                            <strong>{project.title}</strong> - {project.date}
                        </div>
                        <button
                            onClick={() => deleteProject(project.id)}
                            className="ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Manage Project Details</h1>
            <ProjectForm />
            <ProjectList />
        </div>
    );
};

export default ProjectDetailsManager;
