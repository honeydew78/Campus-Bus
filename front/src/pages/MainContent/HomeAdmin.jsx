import React from "react";
// import img from '../../assets/bus2.png'
import img2 from '../../assets/hero.png'
export default function Home() {
   return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-100">
    
    <div className="flex-1 flex flex-col items-start justify-center px-32 py-4 md:py-0 md:h-full">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-16 leading-loose">
          Reserve your <br /> Campus <span className="text-yellow-500 mb-8 mt-8">Bus</span> <br /> Now !
        </h1>
        <div className="flex space-x-4">
          <button className="bg-yellow-500 text-black px-6 py-3 rounded-md hover:bg-yellow-600 transition duration-300">
            To Civil lines
          </button>
          <button className="border border-black border-2 text-black px-6 py-3 rounded-md hover:bg-gray-200 transition duration-300">
            To IIIT
          </button>
        </div>
      </div>
      <div className="flex-1 h-full">
        <img
          src={img2}
          alt="Bus"
          className="object-contain w-full h-full md:h-screen"
        />
      </div>
    </div>
   );
}
