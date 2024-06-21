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
                       <h2 className="text-2xl text-green-900 font-bold md:text-4xl">
                           About The Project
                       </h2>
                       <p className="mt-6 text-#0a0a0a">
                       This project, built using the MERN stack, incorporates various features including CRUD operations on data.
                       </p>
                       <p className="mt-4 text-#0a0a0a">
                       The project is designed to segment trainee data into distinct categories: New Trainees, Current Trainees, and Past Trainees. This segmentation ensures comprehensive data capture at each stage (e.g., enrollment details, progress metrics, final assessments), supports targeted reporting and analysis, optimizes resource allocation and support efforts, and enhances overall user experience by facilitating streamlined data management and access based on the trainee's current status or phase in the program.
                       </p>
                   </div>
               </div>
           </div>
       </div>
   );
}
