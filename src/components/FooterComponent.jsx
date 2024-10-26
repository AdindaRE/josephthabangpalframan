import { IoLogoInstagram, IoMail } from "react-icons/io5";

const FooterComponent = () => {
    return (
        <footer className="bg-black text-white py-16 px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Left Column - Social Links */}
                <div className="flex flex-col items-start space-y-3 text-left">
                    <h4 className="text-lg font-normal tracking-wider">Connect with Us</h4>
                    <div className="flex items-center space-x-4">
                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 hover:underline transition-transform transform hover:translate-y-[-2px] hover:opacity-80"
                        >
                            <IoLogoInstagram className="w-6 h-6" />
                            <span>Instagram</span>
                        </a>
                        <span className="mx-2">|</span>
                        <a
                            href="/contact"
                            className="flex items-center space-x-2 hover:underline transition-transform transform hover:translate-y-[-2px] hover:opacity-80"
                        >
                            <IoMail className="w-6 h-6" />
                            <span>Get in Touch</span>
                        </a>
                    </div>
                </div>

                {/* Middle Column - Explore Section */}
                <div className="flex flex-col space-y-4 text-left">
                    <h4 className="text-lg font-normal tracking-wider">Explore</h4>
                    <ul className="space-y-2">
                        <li>
                            <a href="/about" className="text-base font-light hover:underline">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="/projects" className="text-base font-light hover:underline">
                                Projects
                            </a>
                        </li>
                        <li>
                            <a href="/studiowerk" className="text-base font-light hover:underline">
                                Studiowork
                            </a>
                        </li>
                        <li>
                            <a href="/exhibitions" className="text-base font-light hover:underline">
                                Exhibitions
                            </a>
                        </li>
                        <li>
                            <a href="/contact" className="text-base font-light hover:underline">
                                Get in Touch
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Right Column - Newsletter Signup */}
                <div className="text-left">
                    <h4 className="text-lg font-normal tracking-wider mb-2">Stay in the loop</h4>
                    <p className="text-base font-light mb-4">
                        Subscribe to our mailing list for invitations to exhibition openings and the latest updates on works and events.
                    </p>
                    <form className="flex flex-col space-y-4 w-full md:max-w-sm">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="p-3 border-b border-gray-700 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-white text-black py-2 rounded hover:bg-gray-300 transition-transform transform hover:translate-y-[-2px] hover:opacity-80"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 my-6"></div>

            {/* Bottom Row - Copyright */}
            <div className="text-center">
                <p className="text-sm font-light tracking-wide">
                    © 2024 Joseph Thabang Palframan. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default FooterComponent;
