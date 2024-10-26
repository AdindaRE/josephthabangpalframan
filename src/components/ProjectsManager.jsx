import { useState } from 'react';
import ProjectForm from './ProjectForm'; // Adjust the path as necessary
import ProjectList from './ProjectList'; // Importing ProjectList
import Swal from 'sweetalert2';

// Initial project state
const initialProjectState = {
    id: null,
    title: '',
    description: '',
    imageFile: null,
    caption: '',
    link: '',
};

// ProjectsManager Component
const ProjectsManager = () => {
    const [projects, setProjects] = useState([]); // Initial state for projects
    const [projectItem, setProjectItem] = useState(initialProjectState);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');

    // Reset project item form
    const resetForm = () => {
        setProjectItem(initialProjectState);
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
    const handleSaveProject = async () => {
        // Logic for adding or updating projects in the state
        try {
            setIsUploading(true);
            const action = projectItem.id ? 'updated' : 'added';
            if (projectItem.id) {
                // Update logic
                setProjects(prevProjects =>
                    prevProjects.map(p => (p.id === projectItem.id ? projectItem : p))
                );
            } else {
                // Add new project logic
                setProjects(prevProjects => [
                    ...prevProjects,
                    { ...projectItem, id: Date.now() }, // Use timestamp as ID for local state
                ]);
            }
            setMessage(`Project successfully ${action}!`);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `Project ${action} successfully`,
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error('Error saving project:', error);
            setMessage('Error saving project: ' + error.message);
        } finally {
            setIsUploading(false);
            resetForm(); // Reset the form after saving
        }
    };

    // Delete project
    const handleDeleteProject = (projectId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this project?');
        if (!confirmDelete) return;

        // Remove project from local state
        setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
        setMessage('Project deleted successfully!');
    };

    // Render the form and the project list
    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Manage Projects</h2>
            {message && <div className="mb-4 text-green-600">{message}</div>}

            {/* Project Form */}
            <ProjectForm
                projectItem={projectItem}
                handleChange={handleChange}
                handleSaveProject={handleSaveProject}
                isUploading={isUploading}
            />

            <h3 className="text-xl font-semibold mb-4">Existing Projects</h3>
            <ProjectList
                projects={projects}
                handleDeleteProject={handleDeleteProject}
            />
        </div>
    );
};

export default ProjectsManager;
