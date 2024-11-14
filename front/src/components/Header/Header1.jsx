import React from "react";
import {Link , NavLink} from "react-router-dom"
import logo from '../../assets/buslogo.png'
export default function Header() {
   return (
       <header className="shadow sticky z-50 top-0">
           <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
               <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                   <Link to="/" className="flex items-center">
                       <img
                           src={logo}
                           className="mr-3 h-12"
                           alt="Logo"
                       />
                   </Link>
                   <div className="flex items-center lg:order-2">
                       <Link to="/login"
                        //    to="#"
                           className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                       >
                           Login
                       </Link>
                       <Link to="/register"
                        //    to="#"
                           className="text-black bg-yellow-500 hover:bg-yellow-700 focus:ring-4 focus:ring-lime-100 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                       >
                           Register
                       </Link>
                   </div>
                   <div
                       className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                       id="mobile-menu-2"
                   >
                       <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                           <li>
                               <NavLink to="/"
                                   className={({isActive}) =>
                                       `block py-2 pr-4 pl-3 duration-200 
                                    ${isActive ? "text-yellow-600"
                                               : "text-grey-700"} 
                                               border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-yellow-700 lg:p-0`
                                   }
                                >
                                Home
                               </NavLink>
                           </li>
                           <li>
                               <NavLink to="/about"
                                   className={({isActive}) =>
                                       `block py-2 pr-4 pl-3 duration-200 
                                    ${isActive ? "text-yellow-700"
                                               : "text-grey-700"} 
                                               border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-yellow-700 lg:p-0`
                                   }
                                >
                                About
                               </NavLink>
                           </li>
                       </ul>
                   </div>
               </div>
           </nav>
       </header>
   );
}