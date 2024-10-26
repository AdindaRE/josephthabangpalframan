import { useState } from 'react';
import { Link } from 'react-router-dom';

export function NavbarComponent() {
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
        <div className="relative z-50">
            <button
                onClick={toggleSidebar}
                className="fixed top-6 right-6 z-50 text-white p-4 bg-black text-lg font-light mt-2 text-xl leading-[1.2em] tracking-[0.8px] text-black font-sans"
            >
                {sidebarOpen ? 'Close' : 'Menu'}
            </button>

            <div
                className={`fixed inset-0 bg-black bg-opacity-90 transition-opacity duration-[400ms] ease-in-out ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <div className="flex flex-col h-full justify-center items-center p-6 text-center">

                    <div className="flex flex-col items-center space-y-8">
                        {navItems.map(({ to, text }, index) => (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setSidebarOpen(false)}
                                className={`text-[22px] font-light text-white transition-opacity duration-300 ease-in-out ${sidebarOpen && !isFadingOut
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

                    <div className="flex space-x-6 mt-16">
                        <a
                            href="https://twitter.com/yourprofile"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white text-4xl hover:text-gray-400 transition-colors duration-300"
                        >
                            <i className="fab fa-twitter"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

const navItems = [
    { to: "/home", text: "HOME" },
    { to: "/about", text: "ABOUT" },
    { to: "/projects", text: "PROJECTS" },
    { to: "/studiowork", text: "STUDIO WORK" },
    { to: "/exhibitions", text: "EXHIBITIONS" },
    { to: "/contact", text: "CONTACT" },
];

export default NavbarComponent;
