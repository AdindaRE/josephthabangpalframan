

const AboutComponent = () => {
    return (
        <div className="bg-white text-gray-900 min-h-screen flex items-center justify-center">
            {/* About Section */}
            <section className="relative w-full py-10 px-4 md:px-12"> {/* Reduced top padding */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-medium uppercase tracking-tight font-montserrat mb-6 leading-tight">
                        Behind the Artist
                    </h2>
                </div>

                <div className="flex flex-col items-center">
                    {/* Biography */}
                    <div className="space-y-6 text-lg font-light font-open-sans leading-relaxed text-center md:text-justify max-w-3xl">
                        <p style={{ letterSpacing: '0.8px' }}>
                            Joseph Thabang Palframan (born 1997, Windhoek, Namibia) is an artist currently living and working in Belgium.
                            Palframan was born to mixed parents at the beginning of the post-apartheid era; narrowly escaping being born a crime.
                            He moved between Southern Africa and Europe several times throughout his childhood. His work takes inspiration and
                            imagery from Democracy, ‘Hood Culture’, Music videos and which ‘roles and representations’ might open up in the future.
                        </p>
                        <p style={{ letterSpacing: '0.8px' }}>
                            Palframan explores how to communicate disruptions and polarities; the darker sides of reality and psyche are allowed
                            to find place in the work. Thematically Palframan looks at how to pull these themes into the spotlight while still
                            maintaining shadowy truths.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutComponent;