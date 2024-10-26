import NavItem from './NavItem'; // Import each nav item
// Sidebar Menu Component
const SidebarMenu = ({ isOpen, isFadingOut, onClose }) => {
    const navItems = [
        { to: "/home", text: "HOME" },
        { to: "/about", text: "ABOUT" },
        { to: "/projects", text: "PROJECTS" },
        { to: "/studiowork", text: "STUDIOWORK" },
        { to: "/exhibitions", text: "EXHIBITIONS" },
        { to: "/contact", text: "CONTACT" },
    ];

    // This onClick is on the overlay, which closes the menu when clicked
    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-90 transition-opacity duration-500 ease-in-out z-50 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose} // Close menu on clicking anywhere on the overlay
        >
            <div className="flex flex-col h-full justify-center items-center p-6 text-center" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col items-center space-y-8">
                    {navItems.map((item, index) => (
                        <NavItem
                            key={item.to}
                            to={item.to}
                            text={item.text}
                            isOpen={isOpen}
                            isFadingOut={isFadingOut}
                            index={index}
                            totalItems={navItems.length}
                            onClick={onClose} // Close menu on clicking a nav item
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SidebarMenu;
