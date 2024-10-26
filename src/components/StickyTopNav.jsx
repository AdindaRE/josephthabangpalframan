import { useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarMenu from './SidebarMenu'; // Import the SidebarMenu

// Top Navigation Component
const StickyTopNav = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    // Toggle the sidebar open/close
    const toggleSidebar = () => {
        if (sidebarOpen) {
            setIsFadingOut(true);
            setTimeout(() => {
                setIsFadingOut(false);
                setSidebarOpen(false);
            }, 1200); // Matches the duration of staggered fade-out
        } else {
            setSidebarOpen(true);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full z-50">
            {/* Top Navigation Bar */}
            <div className="flex justify-between items-center pl-8 pr-8 py-4">
                {/* Branding */}
                <Link
                    to="/home"
                    className="text-xl leading-[1.2em] tracking-[0.8px] text-black font-sans hover:translate-y-[-3px] hover:opacity-80"
                >
                    Joseph Thabang Palframan ©
                </Link>

                {/* Menu Button */}
                <button
                    onClick={toggleSidebar}
                    className={`text-lg font-light mt-0 text-xl leading-[1.2em] tracking-[0.8px] bg-black text-white p-2 transition-transform ${sidebarOpen ? 'fixed right-8 top-4 z-[100]' : 'relative z-50'
                        }`}
                >
                    {sidebarOpen ? 'Close' : 'Menu'}
                </button>
            </div>

            {/* Sidebar Menu */}
            <SidebarMenu
                isOpen={sidebarOpen}
                isFadingOut={isFadingOut}
                onClose={() => setSidebarOpen(false)}
            />
        </div>
    );
};

export default StickyTopNav;
