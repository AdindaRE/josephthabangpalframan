import { useState, useEffect, useCallback } from 'react';
import { db, storage } from '../firebase-config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import Swal from 'sweetalert2';

// Constants
const MAX_PROJECTS = 10;
const initialProjectState = {
    id: null,
    title: '',
    description: '',
    imageFile: null,
    caption: '',
    link: '',
};

// ProjectForm Component
const ProjectForm = ({ projectItem, handleChange, handleSaveProject, isUploading }) => (
    <form className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mb-6" onSubmit={(e) => { e.preventDefault(); handleSaveProject(); }}>
        <div className="mb-4">
            <input
                type="text"
                placeholder="Title"
                name="title"
                value={projectItem.title}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        <div className="mb-4">
            <textarea
                placeholder="Description"
                name="description"
                value={projectItem.description}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="5"
                required
            />
        </div>

        <div className="mb-4">
            <input
                type="file"
                accept="image/*"
                name="imageFile"
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div className="mb-4">
            <input
                type="text"
                name="caption"
                placeholder="Caption"
                value={projectItem.caption}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div className="mb-4">
            <input
                type="text"
                placeholder="Link"
                name="link"
                value={projectItem.link}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div className="flex justify-end">
            <button
                type="submit"
                className={`bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition ease-in-out duration-150 focus:ring-2 focus:ring-blue-400 focus:outline-none ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                disabled={isUploading}
            >
                {isUploading ? 'Saving...' : projectItem.id ? 'Update Project' : 'Add Project'}
            </button>
        </div>
    </form>

);

// Define prop types for ProjectForm
ProjectForm.propTypes = {
    projectItem: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        imageFile: PropTypes.instanceOf(File),
        caption: PropTypes.string,
        link: PropTypes.string,
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSaveProject: PropTypes.func.isRequired,
    isUploading: PropTypes.bool.isRequired,
};

// ProjectList Component
const ProjectList = ({ projects, handleEditProject, handleDeleteProject }) => (
    <ul>
        {projects.map((project) => (
            <li key={project.id} className="mb-4">
                <p>
                    <strong>{project.title}</strong> - {project.caption}
                </p>
                {project.image && <img src={project.image} alt={project.title} className="w-32 h-auto mb-2" />}
                {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        View Project
                    </a>
                )}
                <div>
                    <button
                        onClick={() => handleEditProject(project)}
                        className="bg-yellow-500 text-white px-4 py-2 mr-2"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteProject(project)}
                        className="bg-red-500 text-white px-4 py-2"
                    >
                        Delete
                    </button>
                </div>
            </li>
        ))}
    </ul>
);

// Define prop types for ProjectList
ProjectList.propTypes = {
    projects: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            image: PropTypes.string,
            caption: PropTypes.string,
            link: PropTypes.string,
        })
    ).isRequired,
    handleEditProject: PropTypes.func.isRequired,
    handleDeleteProject: PropTypes.func.isRequired,
};

// Main ProjectsManager Component
const ProjectsManager = () => {
    const [projects, setProjects] = useState([]);
    const [projectItem, setProjectItem] = useState(initialProjectState);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showAddedMessage, setShowAddedMessage] = useState(false);

    const projectsCollectionRef = collection(db, 'projects');

    // Fetch projects from Firestore
    const fetchProjects = useCallback(async () => {
        try {
            const projectQuery = query(projectsCollectionRef, limit(MAX_PROJECTS));
            const projectDocs = await getDocs(projectQuery);
            const projectList = projectDocs.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProjects(projectList);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setMessage('Error fetching projects: ' + error.message);
        }

    }, [projectsCollectionRef]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Handle image upload
    const handleImageUpload = async (imageFile) => {
        if (!imageFile) return '';

        try {
            const storageRef = ref(storage, `project-images/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage('Error uploading image: ' + error.message);
            return '';
        }
    };

    // Handle input changes for projectItem
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setProjectItem(prevState => ({
            ...prevState,
            [name]: name === 'imageFile' ? files[0] : value,
        }));
    };

    // Save project (Add or Update)
    // Save project (Add or Update)
    const handleSaveProject = async () => {
        try {
            setIsUploading(true);

            // Upload image and get the URL
            const imageUrl = projectItem.imageFile ? await handleImageUpload(projectItem.imageFile) : '';

            // Prepare project data without the imageFile field
            const { imageFile, ...projectData } = { ...projectItem, image: imageUrl };

            if (projectItem.id) {
                // Update existing project
                await updateDoc(doc(db, 'projects', projectItem.id), projectData);
                setMessage('Project updated successfully!');
            } else {
                // Add new project
                const docRef = await addDoc(projectsCollectionRef, projectData);
                setProjects(prevProjects => [...prevProjects, { ...projectData, id: docRef.id }]);
                setMessage('Project added successfully!');
                setShowAddedMessage(true);
            }

            // Reset form
            resetForm();
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `New project is saved successfully`,
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error('Error saving project:', error);
            setMessage('Error saving project: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };


    // Reset project item form
    const resetForm = () => {
        setProjectItem(initialProjectState);
    };

    // Edit project
    const handleEditProject = (project) => {
        setProjectItem(project);
        setShowAddedMessage(false);
    };

    // Delete project
    const handleDeleteProject = async (project) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this project?');
        if (!confirmDelete) return;

        try {
            const projectDoc = doc(db, 'projects', project.id);
            if (project.image) {
                const fileName = decodeURIComponent(project.image.split('%2F').pop().split('?')[0]);
                await deleteObject(ref(storage, `project-images/${fileName}`));
            }
            await deleteDoc(projectDoc);
            setProjects(prevProjects => prevProjects.filter(p => p.id !== project.id));
            setMessage('Project deleted successfully!');
        } catch (error) {
            console.error('Error deleting project:', error);
            setMessage('Error deleting project: ' + error.message);
        }
    };

    // Clear the "Added" message after a delay
    useEffect(() => {
        if (showAddedMessage) {
            const timer = setTimeout(() => setShowAddedMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showAddedMessage]);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Manage Projects</h2>
            {message && <div className="mb-4 text-green-600">{message}</div>}
            {showAddedMessage && <div className="mb-4 text-blue-600">Added</div>}

            {/* Project Form */}
            <ProjectForm
                projectItem={projectItem}
                handleChange={handleChange}
                handleSaveProject={handleSaveProject}
                isUploading={isUploading}
            />

            <h3 className="text-xl font-semibold mb-4">Existing Projects</h3>
            {/* Project List */}
            <ProjectList
                projects={projects}
                handleEditProject={handleEditProject}
                handleDeleteProject={handleDeleteProject}
            />
        </div>
    );
};

export default ProjectsManager;
