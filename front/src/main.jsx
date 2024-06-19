import React from 'react';
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Layout1 from './Layout1';
import Home from './pages/Home';
import About from './pages/About';
import HomeAdmin from './pages/MainContent/HomeAdmin';
import HomeNewTrainee from './pages/MainContent/HomeNewTrainee';
import RegisterNewTrainee from './pages/MainContent/NewTrainee/RegisterNewTrainee'
import FindNewTrainee from './pages/MainContent/NewTrainee/FindNewTrainee'
import Layout2 from './Layout2';
import GetNewTrainee from './pages/MainContent/NewTrainee/GetNewTrainee'
import Logout from './pages/Logout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout1/>}>
        <Route index element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route path="/home-admin" element={<Layout2/>}>
        <Route index element={<HomeAdmin/>}/>
        <Route path="/home-admin/home-new-trainees" element={<HomeNewTrainee/>}/>
        <Route path="/home-admin/home-new-trainees/register" element={<RegisterNewTrainee/>}/>
        <Route path="/home-admin/home-new-trainees/find-new-trainee" element={<FindNewTrainee/>}/>
        <Route path="/home-admin/home-new-trainees/:id" element={<GetNewTrainee/>}/> {/* Adjusted route */}
        <Route path="/home-admin/logout" element={<Logout/>}/>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
