// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import './index.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Layout1 from './Layout1';
import Layout2 from './Layout2';
import Home from './pages/Home';
import About from './pages/About';
import HomeAdmin from './pages/MainContent/HomeAdmin';
import BusSeatBooking from './pages/MainContent/BusSeat';
import Ticket from './pages/MainContent/Ticket';

import Logout from './pages/Logout';
import AdminProfile from './pages/MainContent/AdminProfile';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout1 />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route path="/home-admin" element={<ProtectedRoute element={<Layout2 />} />}>
        <Route index element={<ProtectedRoute element={<HomeAdmin />} />} />
        <Route path="/home-admin/Bus-seat" element={<ProtectedRoute element={<BusSeatBooking />} />} />
        <Route path="/home-admin/ticket" element={<ProtectedRoute element={<Ticket />} />} />
        <Route path="/home-admin/profile" element={<ProtectedRoute element={<AdminProfile />} />} />
        <Route path="/home-admin/logout" element={<ProtectedRoute element={<Logout />} />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
