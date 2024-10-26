import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IoHeartOutline } from 'react-icons/io5';

// Project details
const projectDetails = {
    1: {
        title: 'Upington 26',
        date: '2022-2023',
        mainImage: '/assets/images/Upington26Detail.jpg',
        description: 'Explore the story of Upington 26, a significant historical event in South Africa’s anti-apartheid movement.',
        additionalImages: [
            '/assets/images/upington26/Upington26.jpg',
            '/assets/images/upington26/upington01.jpg',
            '/assets/images/upington26/581c31e0-7f25-4a38-a319-8d93773e465d.jpg',
        ],
        researchImages: [
            { src: '/assets/images/upington26/Upington26.jpg', caption: 'Research Image 1: Initial Concepts' },
            { src: '/assets/images/upington26/upington01.jpg', caption: 'Research Image 2: Community Engagement' },
            { src: '/assets/images/upington26/581c31e0-7f25-4a38-a319-8d93773e465d.jpg', caption: 'Research Image 3: Art in Context' },
            { src: '/assets/images/upington26/Upington26.jpg', caption: 'Research Image 1: Initial Concepts' },
            { src: '/assets/images/upington26/upington01.jpg', caption: 'Research Image 2: Community Engagement' },
            { src: '/assets/images/upington26/581c31e0-7f25-4a38-a319-8d93773e465d.jpg', caption: 'Research Image 3: Art in Context' },
        ],
        icon: <IoHeartOutline className="w-6 h-6" />,
        about: [
            "Joseph Thabang Palframan (born 1997, Windhoek, Namibia) is an artist currently living and working in Belgium.",
            "Palframan was born to mixed parents at the beginning of the post-apartheid era; narrowly escaping being born a crime.",
            "He moved between Southern Africa and Europe several times throughout his childhood. His work takes inspiration from Democracy, ‘Hood Culture’, and Music videos.",
            "His latest works explore themes of identity and cultural heritage, resonating deeply with his own experiences."
        ],
        partners: ["Partner A", "Collaborator B", "Organization C", "Sponsor D", "Initiative E"],
        references: [
            { name: 'Article 1', link: '#' },
            { name: 'Book 1', link: '#' },
            { name: 'Research Paper', link: '#' },
            { name: 'Exhibition Catalog', link: '#' },
            { name: 'Thesis', link: '#' },
            { name: 'Conference Proceedings', link: '#' },
        ],
        video: '/assets/videos/0121 (1) (2).MP4', // Corrected video path
    },
    2: {
        title: 'You Need A Token',
        date: '19th August 2022',
        mainImage: '/assets/images/ExhibtionImageresize.jpg',
        description: 'The first exhibition featuring one white artist, focused on the "Black" artist narrative and how contemporary culture is changing.',
        additionalImages: [
            '/assets/images/ExhibtionImageresize.jpg',
            '/assets/images/2caf22e3-e282-45c4-9275-aaa85e042dfe.JPG',
        ],
        researchImages: [
            { src: '/assets/images/upington26/Upington26.jpg', caption: 'Research Image 1: Initial Concepts' },
            { src: '/assets/images/upington26/upington01.jpg', caption: 'Research Image 2: Community Engagement' },
            { src: '/assets/images/upington26/581c31e0-7f25-4a38-a319-8d93773e465d.jpg', caption: 'Research Image 3: Art in Context' },
            { src: '/assets/images/upington26/Upington26.jpg', caption: 'Research Image 1: Initial Concepts' },
            { src: '/assets/images/upington26/upington01.jpg', caption: 'Research Image 2: Community Engagement' },
            { src: '/assets/images/upington26/581c31e0-7f25-4a38-a319-8d93773e465d.jpg', caption: 'Research Image 3: Art in Context' },
        ],
        icon: <IoHeartOutline className="w-6 h-6" />,
        about: [
            "This exhibition is situated in the heart of the harbour of Rotterdam and aims to observe how the 'Black' artist narrative is evolving in western contemporary culture.",
            "It addresses the themes of Tokenism, Wokenism, and Jokenism, focusing on the experiences of both the dominant and token identities."
        ],
        partners: [
            "@ayla aaron (Managerial team)",
            "@Iman (Curatorial team)",
            "Stedelijk Museum",
            "Brutus and Gallery Ron Mandos (space rental)"
        ],
        references: [
            { name: 'Joseph Palframan', link: '#' },
            { name: 'Exhibition Catalog', link: '#' },
            { name: 'Art Review', link: '#' }
        ],
        video: '/assets/videos/0121 (1) (2).MP4', // Corrected video path
    }, 3: {
        title: 'Will You Find Love?',
        date: '19th August 2022',
        mainImage: 'public/assets/images/ProjectImageeditready.jpg',
        description: 'The first exhibition featuring one white artist, focused on the "Black" artist narrative and how contemporary culture is changing.',
        additionalImages: [
            'public/assets/images/ProjectImageeditready.jpg',
            '/assets/images/2caf22e3-e282-45c4-9275-aaa85e042dfe.JPG',
        ],
        researchImages: [
            { src: '/assets/images/upington26/Upington26.jpg', caption: 'Research Image 1: Initial Concepts' },
            { src: '/assets/images/upington26/upington01.jpg', caption: 'Research Image 2: Community Engagement' },
            { src: '/assets/images/upington26/581c31e0-7f25-4a38-a319-8d93773e465d.jpg', caption: 'Research Image 3: Art in Context' },
            { src: '/assets/images/upington26/Upington26.jpg', caption: 'Research Image 1: Initial Concepts' },
            { src: '/assets/images/upington26/upington01.jpg', caption: 'Research Image 2: Community Engagement' },
            { src: '/assets/images/upington26/581c31e0-7f25-4a38-a319-8d93773e465d.jpg', caption: 'Research Image 3: Art in Context' },
        ],
        icon: <IoHeartOutline className="w-6 h-6" />,
        about: [
            "This exhibition is situated in the heart of the harbour of Rotterdam and aims to observe how the 'Black' artist narrative is evolving in western contemporary culture.",
            "It addresses the themes of Tokenism, Wokenism, and Jokenism, focusing on the experiences of both the dominant and token identities."
        ],
        partners: [
            "@ayla aaron (Managerial team)",
            "@Iman (Curatorial team)",
            "Stedelijk Museum",
            "Brutus and Gallery Ron Mandos (space rental)"
        ],
        references: [
            { name: 'Joseph Palframan', link: '#' },
            { name: 'Exhibition Catalog', link: '#' },
            { name: 'Art Review', link: '#' }
        ],
        video: '/assets/videos/0121 (1) (2).MP4', // Corrected video path
    },

    4: {
        title: 'Will You Find Love?',
        date: '19th August 2022',
        mainImage: 'public/assets/images/Misconception Deception ProtectionPoster.JPG',
        description: 'The first exhibition featuring one white artist, focused on the "Black" artist narrative and how contemporary culture is changing.',
        additionalImages: [
            'public/assets/images/Misconception Deception ProtectionPoster.JPG',
            '/assets/images/2caf22e3-e282-45c4-9275-aaa85e042dfe.JPG',
        ],
        researchImages: [
            { src: '/assets/images/upington26/Upington26.jpg', caption: 'Research Image 1: Initial Concepts' },
            { src: '/assets/images/upington26/upington01.jpg', caption: 'Research Image 2: Community Engagement' },
            { src: '/assets/images/upington26/581c31e0-7f25-4a38-a319-8d93773e465d.jpg', caption: 'Research Image 3: Art in Context' },
            { src: '/assets/images/upington26/Upington26.jpg', caption: 'Research Image 1: Initial Concepts' },
            { src: '/assets/images/upington26/upington01.jpg', caption: 'Research Image 2: Community Engagement' },
            { src: '/assets/images/upington26/581c31e0-7f25-4a38-a319-8d93773e465d.jpg', caption: 'Research Image 3: Art in Context' },
        ],
        icon: <IoHeartOutline className="w-6 h-6" />,
        about: [
            "This exhibition is situated in the heart of the harbour of Rotterdam and aims to observe how the 'Black' artist narrative is evolving in western contemporary culture.",
            "It addresses the themes of Tokenism, Wokenism, and Jokenism, focusing on the experiences of both the dominant and token identities."
        ],
        partners: [
            "@ayla aaron (Managerial team)",
            "@Iman (Curatorial team)",
            "Stedelijk Museum",
            "Brutus and Gallery Ron Mandos (space rental)"
        ],
        references: [
            { name: 'Joseph Palframan', link: '#' },
            { name: 'Exhibition Catalog', link: '#' },
            { name: 'Art Review', link: '#' }
        ],
        video: '/assets/videos/0121 (1) (2).MP4', // Corrected video path
    },

    5: {
        title: 'Landscape of Delfs haven - A Crossroads',
        date: '19th August 2022',
        mainImage: 'public/assets/images/PosterLandscapeofDelfshavenA Crossroads Poster.JPG',
        description: 'The first exhibition featuring one white artist, focused on the "Black" artist narrative and how contemporary culture is changing.',
        additionalImages: [
            'public/assets/images/PosterLandscapeofDelfshavenA Crossroads Poster.JPG',
            '/assets/images/2caf22e3-e282-45c4-9275-aaa85e042dfe.JPG',
        ],
        researchImages: [], // Populate with relevant research images if available
        icon: <IoHeartOutline className="w-6 h-6" />,
        about: [
            "This exhibition is situated in the heart of the harbour of Rotterdam and aims to observe how the 'Black' artist narrative is evolving in western contemporary culture.",
            "It addresses the themes of Tokenism, Wokenism, and Jokenism, focusing on the experiences of both the dominant and token identities."
        ],
        partners: [
            "@ayla aaron (Managerial team)",
            "@Iman (Curatorial team)",
            "Stedelijk Museum",
            "Brutus and Gallery Ron Mandos (space rental)"
        ],
        references: [
            { name: 'Joseph Palframan', link: '#' },
            { name: 'Exhibition Catalog', link: '#' },
            { name: 'Art Review', link: '#' }
        ],
        video: '/assets/videos/0121 (1) (2).MP4', // Corrected video path
    },
};

const ProjectDetailsComponent = () => {
    const { projectId } = useParams();
    const project = projectDetails[projectId];

    // State for managing the current image in the carousel
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Automatically cycle through images every 5 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % project.additionalImages.length);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [project.additionalImages.length]);

    if (!project) {
        return <div className="text-center py-20">Project not found.</div>;
    }

    return (
        <div className="bg-black text-white">

            {/* Video and Audio Section */}
            <section className="relative w-full h-screen bg-gray-800">
                {/* Full Screen Video */}
                <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted>
                    <source src="public/assets/videos/0121 (1) (2).MP4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                    <h2 className="text-3xl font-light text-white">Immerse Yourself in the Experience</h2>
                    <p className="text-lg font-light text-white mt-2">Watch the video while listening to the story behind the Upington 26.</p>
                </div>
                {/* Audio File */}
                <div className="absolute bottom-0 left-0 w-full p-4">
                    <audio controls className="w-full">
                        <source src="path/to/audio-story.mp3" type="audio/mpeg" />
                        Your browser does not support the audio tag.
                    </audio>
                </div>
            </section>

            {/* Full-Size Section */}
            <section className="relative h-[70vh] w-full overflow-hidden">
                <div className="relative w-full h-full">
                    {project.additionalImages.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                            style={{
                                backgroundImage: `url(${image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '70vh'
                            }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Column Section */}
            <section id="column" className="bg-white py-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Column 1: Date */}
                <div className="bg-white p-6 flex flex-col justify-start">
                    <h3 className="text-xl font-light tracking-tight leading-[1.2em] text-gray-800">Date</h3>
                    <p className="text-lg font-normal tracking-[0.8px] text-gray-800 mt-1">{project.date}</p>
                </div>

                {/* Column 2: Title and Short Description */}
                <div className="bg-white p-6 flex flex-col justify-start">
                    <h3 className="text-xl font-light tracking-tight leading-[1.2em] text-gray-800">{project.title}</h3>
                    <p className="text-lg font-light tracking-[0.8px] text-gray-800 mt-2">
                        This project dives into the historical significance and societal impacts of the events surrounding Upington 26, showcasing various perspectives through artistic expression.
                    </p>
                </div>

                {/* Column 3: Partners */}
                <div className="bg-white p-6 flex flex-col justify-start">
                    <h3 className="text-xl font-light tracking-tight leading-[1.2em] text-gray-800">Partners and Collaborations</h3>
                    <ul className="list-disc list-inside mt-2 text-lg font-light tracking-[0.8px] text-gray-800">
                        {project.partners.map((partner, index) => (
                            <li key={index}>{partner}</li>
                        ))}
                    </ul>
                </div>

                {/* Column 4: references */}
                <div className="bg-white p-6 flex flex-col justify-start">
                    <h3 className="text-xl font-light tracking-tight leading-[1.2em] text-gray-800">References</h3>
                    <ul className="list-disc list-inside mt-2 text-lg font-light tracking-[0.8px] text-gray-800">
                        {project.references.map((item, index) => (
                            <li key={index}>
                                <Link to={item.link} className="hover:underline text-gray-800">{item.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* New Project Overview Section */}
            <section className="bg-white py-8 px-4">
                <div className="grid grid-cols-4 gap-4">
                    {/* Empty left 1/4 grid */}
                    <div className="col-span-1"></div>

                    {/* Project Overview occupying 3/4 of the screen */}
                    <div className="col-span-3">
                        <div className="container mx-auto">
                            <h3 className="text-2xl font-light text-gray-800 text-center mb-4">Project Overview</h3>
                            <p className="text-lg font-light tracking-[0.8px] text-gray-800 mt-2">
                                The Upington 26 (14) was one of the most reported international cases for South Africa and its anti-apartheid movement. Clashes with the apartheid regime sculpted and sabotaged the South African townships we know today, and the stories that came with them are only remembered and told by the family members that were there, as a living auditory archive. On Joseph’s most recent visit to South Africa, 24 years later he was there to listen and to see. These stories have to be retold and remembered for us to understand our international landscape and the complexities of our shared human experience.
                            </p>
                            <p className="text-lg font-light tracking-[0.8px] text-gray-800 mt-2">
                                In this new collaboration, Joseph will work with the community in Paballelo to create and install a traditional hand-painted theater poster for this production. He aims to digitally archive Chulu’s production (interviews, photo montages, and written accounts) and develop a handcrafted poster. The handmade poster for Stadschouwberg will first be produced in Joseph’s studio in Leuven and installed at the theater.
                            </p>
                            <p className="text-lg font-light tracking-[0.8px] text-gray-800 mt-2">
                                Placed on either side of its entrance, Joseph imagines the hand-painted poster hung in the large built-in frames, which traditionally would have been used for the play. This display could also help retell the architectural story of the Stadschouwberg.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Freeform Research Gallery Section */}
            <section className="bg-white py-8 px-4">
                <div className="grid grid-cols-4 gap-4">
                    {/* Empty left 1/4 grid */}
                    <div className="col-span-1"></div>

                    {/* Research Gallery occupying 3/4 of the screen */}
                    <div className="col-span-3">
                        <div className="container mx-auto">
                            <h3 className="text-2xl font-light text-gray-800 text-center mb-8">Research</h3>
                            <div className="grid grid-cols-12 gap-6">
                                {project.researchImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`relative ${index % 2 === 0 ? 'col-span-6 md:col-span-4' : 'col-span-12 md:col-span-8'} bg-gray-200 overflow-hidden`}
                                        style={{
                                            height: `${index % 2 === 0 ? '300px' : '500px'}`,
                                            gridRow: index % 3 === 0 ? 'span 2' : 'span 1'
                                        }}
                                    >
                                        <img
                                            src={image.src}
                                            alt={image.caption}
                                            className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                                        />
                                        <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white text-sm p-2">
                                            {image.caption}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default ProjectDetailsComponent;
