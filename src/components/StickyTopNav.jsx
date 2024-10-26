import { useState } from 'react';
import { Link } from 'react-router-dom';

const StickyTopNav = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const toggleSidebar = () => {
        if (sidebarOpen) {
            setIsFadingOut(true);
            setTimeout(() => {
                setIsFadingOut(false);
                setSidebarOpen(false);
            }, navItems.length * 200);
        } else {
            setSidebarOpen(true);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full z-50">
            {/* Top Navigation Bar */}
            <div className="flex justify-between items-center p-4">
                {/* Left: Branding */}
                <Link to="/home" className="text-xl leading-[1.2em] tracking-[0.8px] text-black font-sans hover:translate-y-[-3px] hover:opacity-80">
                    Joseph Thabang Palframan ©
                </Link>

                {/* Right: Menu Button with hover effect */}
                <button
                    onClick={toggleSidebar}
                    className="text-lg font-light mt-2 text-xl leading-[1.2em] tracking-[0.8px] text-black font-sans bg-black text-white p-2 z-60 transition-transform transform"
                    style={{ zIndex: 60 }} // Ensures button stays above the sidebar
                >
                    {sidebarOpen ? 'Close' : 'Menu'}
                </button>
            </div>

            {/* Sidebar Menu */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-90 transition-opacity duration-[400ms] ease-in-out z-50 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                style={{ zIndex: 50 }} // Sidebar's z-index is lower than the button
            >
                <div className="flex flex-col h-full justify-center items-center p-6 text-center">
                    <div className="flex flex-col items-center space-y-8">
                        {navItems.map(({ to, text }, index) => (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setSidebarOpen(false)}
                                className={`text-[22px] font-light text-white transition-transform transform ease-in-out ${sidebarOpen && !isFadingOut
                                    ? `opacity-100 delay-${index * 200}`
                                    : `opacity-0 delay-${(navItems.length - index - 1) * 200}`
                                    }`}
                                style={{
                                    transitionDelay: sidebarOpen && !isFadingOut
                                        ? `${index * 200}ms`
                                        : `${(navItems.length - index - 1) * 200}ms`,
                                }}
                            >
                                {text}
                            </Link>
                        ))}
                    </div>

                    {/* Social Icons */}
                    <div className="flex space-x-6 mt-16">
                        <a
                            href="https://twitter.com/yourprofile"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white text-4xl transition-transform transform hover:translate-y-[-3px] hover:opacity-80"
                        >
                            <i className="fab fa-twitter"></i>
                        </a>
                        {/* Add more icons as needed */}
                    </div>
                </div>
            </div>
        </div>
    );
};

const navItems = [
    { to: "/home", text: "HOME" },
    { to: "/about", text: "ABOUT" },
    { to: "/projects", text: "PROJECTS" },
    { to: "/studiowork", text: "STUDIOWORK" },
    { to: "/exhibitions", text: "EXHIBITIONS" },
    { to: "/contact", text: "CONTACT" },
];

export default StickyTopNav;
