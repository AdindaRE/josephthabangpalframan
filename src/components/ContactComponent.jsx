import { useState } from 'react';

const ContactComponent = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    return (
        <div className="bg-white text-black min-h-screen py-16 px-6 md:px-16">
            <h1 className="text-5xl font-light text-center mb-12 tracking-tight">
                Contact Us
            </h1>
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200">
                        <label htmlFor="name" className="block text-lg font-light mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 bg-white text-black rounded-md shadow-sm focus:ring-2 focus:ring-black transition duration-300"
                            required
                        />
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200">
                        <label htmlFor="email" className="block text-lg font-light mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 bg-white text-black rounded-md shadow-sm focus:ring-2 focus:ring-black transition duration-300"
                            required
                        />
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200">
                        <label htmlFor="message" className="block text-lg font-light mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="6"
                            className="w-full p-4 border border-gray-300 bg-white text-black rounded-md shadow-sm focus:ring-2 focus:ring-black transition duration-300"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-4 px-6 bg-black text-white font-light rounded-md shadow-lg hover:bg-gray-800 transition duration-300"
                        >
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactComponent;
