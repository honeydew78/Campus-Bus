import React from "react";
import query from '../../assets/query2.png';


export default function ContactForm() {
  return (
    <div className="flex flex-row h-auto bg-gray-100">
      <div className="w-1/2">
        <img src={query} alt="Query Icon" className="w-[70%] h-auto mx-auto mt-8" />
      </div>
      <div className="w-1/2 p-2">
         {/* Form Section */}
      <div className="flex flex-col items-center justify-center flex-grow  bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto pb-12">
        <h1 className="text-2xl md:text-2xl font-semibold text-gray-900 mb-8 leading-loose text-center">
          Have a Question? <br /> Send us a <span className="text-yellow-500">Query</span>
        </h1>

        <form
          action="https://formsubmit.co/campusbusiiita@gmail.com" // FormSubmit endpoint
          method="POST"
          className="w-[80%] h-[80%]"
        >
          {/* Hidden fields for FormSubmit */}
          <input type="hidden" name="_subject" value="New Query from Contact Form" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_next" value="http://localhost:4000/ticket-booked" /> {/* Redirect after submission */}

          {/* Name input */}
          <div className="mb-2">
            <label htmlFor="name" className="block text-lg text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Email input */}
          <div className="mb-2">
            <label htmlFor="email" className="block text-lg text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Message input */}
          <div className="mb-2">
            <label htmlFor="message" className="block text-lg text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-yellow-500 text-black px-6 py-2 rounded-md hover:bg-yellow-600 transition duration-300 w-full"
          >
            Send Query
          </button>
        </form>
      </div>


      </div>
    </div>
  );
}
