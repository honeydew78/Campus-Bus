import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/buslogo.png";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="shadow sticky z-50 top-0">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center">
            <img src={logo} className="mr-3 h-12" alt="Logo" />
            <p className="font-medium text-xl">
              Campus <span className="text-yellow-500">Bus</span>
            </p>
          </Link>

          {/* Profile and Logout Buttons */}
          <div className="flex items-center lg:order-2">
            <Link
              to="/home-admin/profile"
              className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
            >
              Your Profile
            </Link>
            <Link
              to="/home-admin/logout"
              className="text-white bg-gray-400 hover:bg-yellow-700 focus:ring-4 focus:ring-lime-100 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
            >
              Logout
            </Link>
            {/* Mobile Menu Toggle Button */}
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none ml-2"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Navigation Links */}
          <div
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } flex-col lg:flex-row lg:flex lg:space-x-8 lg:mt-0 w-full lg:w-auto lg:order-1`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col lg:flex-row lg:space-x-8 w-full lg:w-auto font-medium">
              <li>
                <NavLink
                  to="/home-admin"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-yellow-600" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:p-0`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/home-admin/bus-seat"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-yellow-600" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:p-0`
                  }
                >
                  College to Civil Lines
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/home-admin/bus-seat2"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-yellow-600" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:p-0`
                  }
                >
                  Civil Lines to College
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/home-admin/live-map"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-yellow-600" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:p-0`
                  }
                >
                  Live Location
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/home-admin/ticket-list"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-yellow-600" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:p-0`
                  }
                >
                  History
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/home-admin/query"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-yellow-600" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:p-0`
                  }
                >
                  Query and Feedback
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
