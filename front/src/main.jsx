
// main.jsx
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
import Ticket2 from './pages/MainContent/Ticket2';
import Logout from './pages/Logout';
import AdminProfile from './pages/MainContent/AdminProfile';
import BusSeat2Booking from './pages/MainContent/BusSeat2';
import ContactForm from './pages/MainContent/Feedback';
// import LiveMap from './LiveMap';
import LiveMap from './pages/MainContent/Livemap';
import TicketList from './pages/MainContent/TicketList';

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
        <Route path="/home-admin/bus-seat" element={<ProtectedRoute element={<BusSeatBooking />} />} />
        <Route path="/home-admin/bus-seat2" element={<ProtectedRoute element={<BusSeat2Booking/>} />} />
        <Route path="/home-admin/query" element={<ProtectedRoute element={<ContactForm/>} />} />
        <Route path="/home-admin/ticket" element={<ProtectedRoute element={<Ticket />} />} />
        <Route path="/home-admin/ticket2" element={<ProtectedRoute element={<Ticket2/>} />} />
        <Route path="/home-admin/ticket-list" element={<ProtectedRoute element={<TicketList/>} />} />
        <Route path="/home-admin/profile" element={<ProtectedRoute element={<AdminProfile />} />} />
        <Route path="/home-admin/logout" element={<ProtectedRoute element={<Logout />} />} />
        <Route path="/home-admin/live-map" element={<ProtectedRoute element={<LiveMap />} />} />
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
