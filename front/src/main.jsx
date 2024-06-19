import React from 'react';
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Layout1 from './Layout1';
import Layout2 from './Layout2';
import Home from './pages/Home';
import About from './pages/About';
import HomeAdmin from './pages/MainContent/HomeAdmin';
import HomeNewTrainee from './pages/MainContent/HomeNewTrainee';
import RegisterNewTrainee from './pages/MainContent/NewTrainee/RegisterNewTrainee'
import FindNewTrainee from './pages/MainContent/NewTrainee/FindNewTrainee'
import GetNewTrainee from './pages/MainContent/NewTrainee/GetNewTrainee'
import SelectNewTraineeField from './pages/MainContent/NewTrainee/SelectNewTraineeField'
import CountByInstitute from './pages/MainContent/NewTrainee/CountByInstitute'
import CountByBranch from './pages/MainContent/NewTrainee/CountByBranch'
import CountBySeason from './pages/MainContent/NewTrainee/CountBySeason'
import CountByEstablishment from './pages/MainContent/NewTrainee/CountByEstablishment'
import CountByCity from './pages/MainContent/NewTrainee/CountByCity'


import HomeCurrentTrainee from './pages/MainContent/HomeCurrentTrainee';

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
        <Route path="/home-admin/home-new-trainees/select-field" element={<SelectNewTraineeField/>}/> 
        <Route path="/home-admin/home-new-trainees/select-field/by-institute" element={<CountByInstitute/>}/> 
        <Route path="/home-admin/home-new-trainees/select-field/by-branch" element={<CountByBranch/>}/> 
        <Route path="/home-admin/home-new-trainees/select-field/by-season" element={<CountBySeason/>}/>
        <Route path="/home-admin/home-new-trainees/select-field/by-establishment" element={<CountByEstablishment/>}/>
        <Route path="/home-admin/home-new-trainees/select-field/by-city" element={<CountByCity/>}/>


        <Route path="/home-admin/home-current-trainees" element={<HomeCurrentTrainee/>}/>

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
