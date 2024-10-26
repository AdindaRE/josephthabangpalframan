import { IoLogoInstagram, IoMail } from "react-icons/io5";

const FooterComponent = () => {
    return (
        <footer className="bg-black text-white py-20 px-4 md:px-12 font-open-sans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Left Column - Social Links and Get in Touch */}
                <div className="flex flex-col space-y-6 text-left">
                    <h3 className="text-3xl md:text-4xl font-light uppercase tracking-wide" style={{ letterSpacing: '0.8px', lineHeight: '1.2em' }}>
                        Joseph Thabang Palframan
                    </h3>

                    {/* Grouped Social Links and Get in Touch */}
                    <div className="space-y-4">
                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base md:text-lg font-light flex justify-start items-center space-x-2 transition-transform transform hover:translate-y-[-3px] hover:opacity-80"
                            style={{ letterSpacing: '0.8px', lineHeight: '1.2em' }}
                        >
                            <IoLogoInstagram className="w-5 h-5" />
                            <span>Instagram</span>
                        </a>

                        {/* Get in Touch */}
                        <a
                            href="/contact"
                            className="text-base md:text-lg font-light uppercase flex items-center space-x-2 transition-transform transform hover:translate-y-[-3px] hover:opacity-80"
                            style={{ letterSpacing: '0.8px', lineHeight: '1.2em' }}
                        >
                            <IoMail className="w-5 h-5" />
                            <span>Get in Touch</span>
                        </a>
                    </div>
                </div>

                {/* Middle Column - Empty */}
                <div></div>

                {/* Right Column - Newsletter Signup */}
                <div className="text-left">
                    <h2 className="text-3xl font-light uppercase tracking-tight mb-4" style={{ letterSpacing: '0.8px', lineHeight: '1.2em' }}>
                        Sign up
                    </h2>
                    <p className="text-base md:text-lg font-light mb-4" style={{ letterSpacing: '0.8px', lineHeight: '1.2em' }}>
                        Stay updated for the latest news and exhibitions.
                    </p>
                    <form className="flex flex-col space-y-4 w-full md:max-w-sm">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="p-2 border-b border-gray-700 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all"
                            style={{ letterSpacing: '0.8px', lineHeight: '1.2em' }}
                            required
                        />
                        <button
                            type="submit"
                            className="bg-white text-black py-2 rounded hover:bg-gray-300 transition-transform transform hover:translate-y-[-3px] hover:opacity-80"
                            style={{ letterSpacing: '0.8px', lineHeight: '1.2em' }}
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 my-8"></div>

            {/* Bottom Row - Copyright */}
            <div className="text-center">
                <p className="text-sm font-light" style={{ letterSpacing: '0.8px', lineHeight: '1.2em' }}>
                    © 2024 Joseph Thabang Palframan. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default FooterComponent;
