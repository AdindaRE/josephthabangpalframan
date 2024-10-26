import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs, query, limit } from 'firebase/firestore'; // Firestore utilities

const ProjectSlider = () => {
    const [projects, setProjects] = useState([]); // State to hold projects from Firestore
    const [currentSlide, setCurrentSlide] = useState(0); // To track the current slide
    const [autoplay, setAutoplay] = useState(true); // State to control autoplay
    const [error, setError] = useState(null); // State to hold errors

    // Fetch projects from Firestore
    const fetchProjects = useCallback(async () => {
        try {
            const projectsCollectionRef = collection(db, 'projects');
            const projectsQuery = query(projectsCollectionRef, limit(10)); // Limit to 10 documents
            const projectDocs = await getDocs(projectsQuery);

            // Check if we have any documents
            if (projectDocs.empty) {
                setError("No projects found.");
                return;
            }

            const projectList = projectDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setProjects(projectList); // Update state with the fetched project data
        } catch (err) {
            console.error("Error fetching projects:", err);
            setError("Error fetching projects. Please try again later."); // Handle errors gracefully
        }
    }, []);

    useEffect(() => {
        fetchProjects(); // Fetch projects when component mounts
    }, [fetchProjects]);

    // Handle slide transition (next slide)
    const nextSlide = useCallback(() => {
        if (projects.length > 0) {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % projects.length); // Loop through the slides
        }
    }, [projects]);

    useEffect(() => {
        if (!autoplay || projects.length === 0) return; // If not autoplay or no projects, skip setting interval

        const autoplayInterval = setInterval(() => {
            nextSlide();
        }, 5000); // Slide transition every 5 seconds (adjusted for a better user experience)

        return () => clearInterval(autoplayInterval); // Clean up interval on component unmount
    }, [nextSlide, autoplay, projects]);

    // Event handlers for mouse enter and leave (to control autoplay)
    const handleMouseEnter = () => {
        setAutoplay(false); // Pause autoplay on hover
    };

    const handleMouseLeave = () => {
        setAutoplay(true); // Resume autoplay on hover leave
    };

    return (
        <section id="projects" className="relative bg-white h-screen flex flex-col items-center mt-32 mb-32">
            {/* Full Width Header */}
            <h1 className="w-[calc(40%-2rem)] text-center text-6xl font-light text-black bg-transparent opacity-90 py-8 z-20">
                Featured Projects
            </h1>

            {error ? (
                <p className="text-red-500">{error}</p> // Display error message if there is an error
            ) : projects.length > 0 ? (
                <div
                    className="relative h-[80vh] w-[calc(40%-2rem)] bg-white shadow-lg overflow-hidden cursor-grab mx-auto"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Slider Content */}
                    <div className="slider-content h-full w-full flex flex-col justify-center items-center relative">
                        <div className="relative w-full h-full overflow-hidden z-10">
                            <Link to={projects[currentSlide]?.link} className="absolute inset-0 w-full h-full cursor-pointer">
                                <div
                                    className="absolute inset-0 w-full h-full bg-cover bg-no-repeat bg-center"
                                    style={{ backgroundImage: `url(${projects[currentSlide]?.image})` }}
                                ></div>

                                {/* Project Title in the Left Corner */}
                                <h1 className="absolute top-6 left-6 text-2xl font-light text-black z-20">
                                    {projects[currentSlide]?.title}
                                </h1>
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No projects available</p>
            )}

            {/* Caption Outside the Image Container */}
            {projects.length > 0 && (
                <div
                    className="text-left mt-2 text-sm text-gray-500 z-20"
                    style={{ width: 'calc(40% - 2rem)', margin: '0 auto' }}
                >
                    {projects[currentSlide]?.caption}
                </div>
            )}
        </section>
    );
};

export default ProjectSlider;
