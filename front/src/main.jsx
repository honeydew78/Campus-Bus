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
import ViewAllNewTrainee from './pages/MainContent/NewTrainee/ViewAllNewTrainee';

import ConvertToCurrentButton from './pages/MainContent/NewTrainee/ConvertToCurrentButton';
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
import ViewAllCurrentTrainee from './pages/MainContent/CurrentTrainee/ViewAllCurrentTrainee'
import ConvertToPastButton from './pages/MainContent/CurrentTrainee/ConvertToPastButton';
import ConvertToCurrentTraineeForm from './pages/MainContent/CurrentTrainee/ConvertToCurrent';
import FindCurrentTrainee from './pages/MainContent/CurrentTrainee/FindCurrentTrainee'
import GetCurrentTrainee from './pages/MainContent/CurrentTrainee/GetCurrentTrainee'
import SelectCurrentTraineeField from './pages/MainContent/CurrentTrainee/SelectCurrentTraineeField'
import CountByInstitute2 from './pages/MainContent/CurrentTrainee/CountByInstitute2'
import CountByBranch2 from './pages/MainContent/CurrentTrainee/CountByBranch2'
import CountBySeason2 from './pages/MainContent/CurrentTrainee/CountBySeason2'
import CountByEstablishment2 from './pages/MainContent/CurrentTrainee/CountByEstablishment2'
import CountByCity2 from './pages/MainContent/CurrentTrainee/CountByCity2'
import CountByMentor2 from './pages/MainContent/CurrentTrainee/CountByMentor2'
import CountByDepartment2 from './pages/MainContent/CurrentTrainee/CountByDepartment2'

import HomePastTrainee from './pages/MainContent/HomePastTrainee';
import ViewAllPastTrainee from './pages/MainContent/PastTrainee/ViewAllPastTrainee'
import ConvertToPastTraineeForm from './pages/MainContent/PastTrainee/ConvertToPast';
import FindPastTrainee from './pages/MainContent/PastTrainee/FindPastTrainee';
import GetPastTrainee from './pages/MainContent/PastTrainee/GetPastTrainee';
import SelectPastTraineeField from './pages/MainContent/PastTrainee/SelectPastTraineeField'
import CountByInstitute3 from './pages/MainContent/PastTrainee/CountByInstitute3'
import CountByBranch3 from './pages/MainContent/PastTrainee/CountByBranch3'
import CountBySeason3 from './pages/MainContent/PastTrainee/CountBySeason3'
import CountByEstablishment3 from './pages/MainContent/PastTrainee/CountByEstablishment3'
import CountByCity3 from './pages/MainContent/PastTrainee/CountByCity3'
import CountByMentor3 from './pages/MainContent/PastTrainee/CountByMentor3'
import CountByDepartment3 from './pages/MainContent/PastTrainee/CountByDepartment3'

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
        <Route path="/home-admin/profile" element={<ProtectedRoute element={<AdminProfile />} />} />
        <Route path="/home-admin/home-new-trainees" element={<ProtectedRoute element={<HomeNewTrainee />} />} />
        <Route path="/home-admin/home-new-trainees/view-all" element={<ProtectedRoute element={<ViewAllNewTrainee />} />} />
        <Route path="/home-admin/home-new-trainees/register" element={<ProtectedRoute element={<RegisterNewTrainee />} />} />
        <Route path="/home-admin/home-new-trainees/find-new-trainee" element={<ProtectedRoute element={<FindNewTrainee />} />} />
        <Route path="/home-admin/home-new-trainees/:id" element={<ProtectedRoute element={<GetNewTrainee />} />} /> {/* Adjusted route */}
        <Route path="/home-admin/home-new-trainees/:id/convert" element={<ProtectedRoute element={<ConvertToCurrentButton />} />} /> {/* Adjusted route */}
        <Route path="/home-admin/home-new-trainees/select-field" element={<ProtectedRoute element={<SelectNewTraineeField />} />} /> 
        <Route path="/home-admin/home-new-trainees/select-field/by-institute" element={<ProtectedRoute element={<CountByInstitute />} />} /> 
        <Route path="/home-admin/home-new-trainees/select-field/by-branch" element={<ProtectedRoute element={<CountByBranch />} />} /> 
        <Route path="/home-admin/home-new-trainees/select-field/by-season" element={<ProtectedRoute element={<CountBySeason />} />} />
        <Route path="/home-admin/home-new-trainees/select-field/by-establishment" element={<ProtectedRoute element={<CountByEstablishment />} />} />
        <Route path="/home-admin/home-new-trainees/select-field/by-city" element={<ProtectedRoute element={<CountByCity />} />} />

        <Route path="/home-admin/home-current-trainees" element={<ProtectedRoute element={<HomeCurrentTrainee />} />} />
        <Route path="/home-admin/home-current-trainees/view-all" element={<ProtectedRoute element={<ViewAllCurrentTrainee />} />} />
        <Route path="/home-admin/home-current-trainees/convert" element={<ProtectedRoute element={<ConvertToCurrentTraineeForm />} />} />
        <Route path="/home-admin/home-current-trainees/find-current-trainee" element={<ProtectedRoute element={<FindCurrentTrainee />} />} />
        <Route path="/home-admin/home-current-trainees/:id" element={<ProtectedRoute element={<GetCurrentTrainee />} />} /> {/* Adjusted route */}
        <Route path="/home-admin/home-current-trainees/:id/convert" element={<ProtectedRoute element={<ConvertToPastButton />} />} /> {/* Adjusted route */}
        <Route path="/home-admin/home-current-trainees/select-field" element={<ProtectedRoute element={<SelectCurrentTraineeField />} />} /> 
        <Route path="/home-admin/home-current-trainees/select-field/by-institute" element={<ProtectedRoute element={<CountByInstitute2 />} />} /> 
        <Route path="/home-admin/home-current-trainees/select-field/by-branch" element={<ProtectedRoute element={<CountByBranch2 />} />} /> 
        <Route path="/home-admin/home-current-trainees/select-field/by-season" element={<ProtectedRoute element={<CountBySeason2 />} />} />
        <Route path="/home-admin/home-current-trainees/select-field/by-establishment" element={<ProtectedRoute element={<CountByEstablishment2 />} />} />
        <Route path="/home-admin/home-current-trainees/select-field/by-city" element={<ProtectedRoute element={<CountByCity2 />} />} />
        <Route path="/home-admin/home-current-trainees/select-field/by-mentor" element={<ProtectedRoute element={<CountByMentor2 />} />} />
        <Route path="/home-admin/home-current-trainees/select-field/by-department" element={<ProtectedRoute element={<CountByDepartment2 />} />} />

        <Route path="/home-admin/home-past-trainees" element={<ProtectedRoute element={<HomePastTrainee />} />} />
        <Route path="/home-admin/home-past-trainees/view-all" element={<ProtectedRoute element={<ViewAllPastTrainee />} />} />
        <Route path="/home-admin/home-past-trainees/convert" element={<ProtectedRoute element={<ConvertToPastTraineeForm />} />} />
        <Route path="/home-admin/home-past-trainees/find-past-trainee" element={<ProtectedRoute element={<FindPastTrainee />} />} />
        <Route path="/home-admin/home-past-trainees/:id" element={<ProtectedRoute element={<GetPastTrainee />} />} /> {/* Adjusted route */}
        <Route path="/home-admin/home-past-trainees/select-field" element={<ProtectedRoute element={<SelectPastTraineeField />} />} /> 
        <Route path="/home-admin/home-past-trainees/select-field/by-institute" element={<ProtectedRoute element={<CountByInstitute3 />} />} /> 
        <Route path="/home-admin/home-past-trainees/select-field/by-branch" element={<ProtectedRoute element={<CountByBranch3 />} />} /> 
        <Route path="/home-admin/home-past-trainees/select-field/by-season" element={<ProtectedRoute element={<CountBySeason3 />} />} />
        <Route path="/home-admin/home-past-trainees/select-field/by-establishment" element={<ProtectedRoute element={<CountByEstablishment3 />} />} />
        <Route path="/home-admin/home-past-trainees/select-field/by-city" element={<ProtectedRoute element={<CountByCity3 />} />} />
        <Route path="/home-admin/home-past-trainees/select-field/by-mentor" element={<ProtectedRoute element={<CountByMentor3 />} />} />
        <Route path="/home-admin/home-past-trainees/select-field/by-department" element={<ProtectedRoute element={<CountByDepartment3 />} />} />

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
