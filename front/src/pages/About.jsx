import React from 'react';

export default function About() {
   return (
       <div className="py-16 bg-white">
           <div className="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
               <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
                   <div className="md:w-5/12 lg:w-5/12">
                       <img
                           src="https://i.ibb.co/n1tzgR4/10172518-8294.jpg"
                           alt="image"
                       />
                   </div>
                   <div className="md:w-7/12 lg:w-6/12">
                       <h2 className="text-2xl text-yellow-700 font-bold md:text-4xl">
                           About The Project
                       </h2>
                       <p className="mt-6 text-#0a0a0a">
                       This MERN stack project focuses on bus seat booking for the college campus, enabling easy reservations between the college and Civil Lines.
                       </p>
                       <p className="mt-4 text-#0a0a0a">
                       Features include seat selection, booking confirmation, and user profile management. The interface displays the bus layout for easy seat selection, and trip segmentation ensures clear categorization.

The project enhances user experience with a streamlined interface, supports insights into bus occupancy, and optimizes transport resources for the campus.
                       </p>
                   </div>
               </div>
           </div>
       </div>
   );
}
