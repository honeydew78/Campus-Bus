import React from "react";
import { Link } from "react-router-dom";
// import img from '../../assets/bus2.png'
import img2 from "../../assets/hero.png";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100">
      {/* Text Section */}
      <div className="flex-1 flex flex-col items-start justify-center px-6 md:px-16 py-8 md:py-0">
        <h1 className="text-5xl sm:text-3xl md:text-6xl font-bold text-gray-900 mb-4">
          Reserve your <br />
          Campus <span className="text-yellow-500">Bus</span> <br />
          Now!
        </h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
          <Link
            to="/home-admin/bus-seat"
            className="bg-yellow-500 text-black px-6 py-3 rounded-md hover:bg-yellow-600 transition duration-300"
          >
            To Civil Lines
          </Link>
          <Link
            to="/home-admin/bus-seat2"
            className="border border-black text-black mt-4 px-6 py-3 rounded-md hover:bg-gray-200 transition duration-300"
          >
            To IIIT
          </Link>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex-1 h-full px-6 md:px-16 py-8 md:py-0">
        <img
          src={img2}
          alt="Bus"
          className="object-contain w-full h-auto max-h-[500px] md:max-h-none"
        />
      </div>
    </div>
  );
}
