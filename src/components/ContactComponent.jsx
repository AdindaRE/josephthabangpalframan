import { IoMail } from 'react-icons/io5';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ContactComponent = () => {
    const sectionRef = useRef(null);
    const questionRef = useRef(null);
    const emailRef = useRef(null);

    useEffect(() => {
        // Animate the question and email links
        const timeline = gsap.timeline({ defaults: { duration: 0.4, ease: 'ease-in-out' } });

        // Animate the question first
        timeline.fromTo(
            questionRef.current,
            { opacity: 0, y: 20 }, // Start from invisible and lower
            { opacity: 1, y: 0 }    // Fade in to original position
        );

        // Animate the email links with a staggered effect
        timeline.fromTo(
            emailRef.current,
            { opacity: 0, y: 20 }, // Start from invisible and lower
            { opacity: 1, y: 0, stagger: 0.1, delay: 0.2 } // Staggered fade-in
        );
    }, []);

    return (
        <div className="bg-white text-gray-900 min-h-screen flex items-center justify-center">
            {/* Contact Section */}
            <section ref={sectionRef} className="relative w-full py-24 px-4 md:px-12">
                <div className="text-center mb-16">
                    <h2
                        ref={questionRef}
                        className="text-6xl font-light tracking-tight font-open-sans mb-10"
                    >
                        Have a question or want to collaborate?
                    </h2>
                </div>

                <div ref={emailRef} className="flex justify-center space-x-8 opacity-0">
                    {/* Email Links */}
                    <a
                        href="mailto:Josephthabangpalframan@gmail.com"
                        className="flex items-center text-lg font-light hover:underline transition-all duration-200 leading-relaxed"
                        style={{ letterSpacing: '0.8px' }}
                    >
                        <IoMail className="w-6 h-6 mr-2 text-black transition-transform duration-200 ease-in-out transform hover:scale-110" />
                        Josephthabangpalframan@gmail.com
                    </a>
                    <span className="text-gray-500">|</span>
                    <a
                        href="mailto:Info@upstreamgallery.nl"
                        className="flex items-center text-lg font-light hover:underline transition-all duration-200 leading-relaxed"
                        style={{ letterSpacing: '0.8px' }}
                    >
                        <IoMail className="w-6 h-6 mr-2 text-black transition-transform duration-200 ease-in-out transform hover:scale-110" />
                        Info@upstreamgallery.nl
                    </a>
                </div>
            </section>
        </div>
    );
};

export default ContactComponent;
