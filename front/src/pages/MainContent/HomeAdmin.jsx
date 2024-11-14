import React from "react";

export default function Home() {
   return (
       <div className="mx-auto w-full max-w-7xl">
           <aside className="relative overflow-hidden text-black rounded-lg sm:mx-16 mx-2 sm:py-16">
               <div className="relative z-10 max-w-screen-xl px-4  pb-20 pt-10 sm:py-24 mx-auto sm:px-6 lg:px-8">
                   <div className="max-w-xl sm:mt-1 mt-80 space-y-8 text-center sm:text-right sm:ml-auto">
                       <h2 className="text-4xl font-bold sm:text-5xl">
                           Hello User
                           <span className="hidden sm:block text-4xl">Book Your Bus Through this Web.</span>
                       </h2>
                   </div>
               </div>

               <div className="absolute inset-0 w-full sm:my-20 sm:pt-1 pt-12 h-full ">
                   <img className="w-96" src="https://i.ibb.co/qgHcGjr/20945457.jpg" alt="image1" />
               </div>
           </aside>
           <h1 className="text-center text-2xl sm:text-12xl py-10 font-medium">Update this line</h1>
       </div>
   );
}
