import { Link } from 'react-router-dom';

// Navigation Item Component
const NavItem = ({ to, text, isOpen, isFadingOut, index, totalItems, onClick }) => {
    // Calculate the delay for staggered animation
    const delay = isOpen && !isFadingOut
        ? `${index * 200}ms`
        : `${(totalItems - index - 1) * 200}ms`;

    const classNames = `
    text-[22px] font-light text-white transition-all transform ease-in-out duration-500
    ${isOpen && !isFadingOut ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
    hover:scale-105 hover:opacity-80
  `;

    return (
        <Link
            to={to}
            onClick={onClick}
            className={classNames}
            style={{ transitionDelay: delay }}
        >
            {text}
        </Link>
    );
};

export default NavItem;
