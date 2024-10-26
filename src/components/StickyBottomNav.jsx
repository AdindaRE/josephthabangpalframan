import { Link } from 'react-router-dom';

const StickyBottomNav = () => {
    return (
        <div className="fixed bottom-0 left-0 w-full flex justify-between px-8 py-4 z-50">
            <Link
                to="/projects"
                className="text-xl leading-[1.2em] tracking-[0.8px] text-black font-sans transition-transform transform hover:translate-y-[-3px] hover:opacity-80"
            >
                Studio Work
            </Link>
            <Link
                to="/exhibitions"
                className="text-xl leading-[1.2em] tracking-[0.8px] text-black font-sans transition-transform transform hover:translate-y-[-3px] hover:opacity-80"
            >
                Upcoming Exhibitions
            </Link>
        </div>
    );
};

export default StickyBottomNav;
