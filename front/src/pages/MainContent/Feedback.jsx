import React from "react";

export default function ContactForm() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Form Section */}
      <div className="flex flex-col items-center justify-center flex-grow min-h-[80vh] bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto pb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-loose text-center">
          Have a Question? <br /> Send us a <span className="text-yellow-500">Query</span>
        </h1>

        <form
          action="https://formsubmit.co/campusbusiiita@gmail.com" // FormSubmit endpoint
          method="POST"
          className="w-full"
        >
          {/* Hidden fields for FormSubmit */}
          <input type="hidden" name="_subject" value="New Query from Contact Form" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_next" value="http://localhost:3000/ticket-booked" /> {/* Redirect after submission */}

          {/* Name input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Email input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Message input */}
          <div className="mb-4">
            <label htmlFor="message" className="block text-lg text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows="5"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-yellow-500 text-black px-6 py-3 rounded-md hover:bg-yellow-600 transition duration-300 w-full"
          >
            Send Query
          </button>
        </form>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="text-center">
          <p>&copy; 2024 Campus Bus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
