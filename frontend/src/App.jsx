import { useState } from 'react'
import './App.css'
import Home from "./Components/Home";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import './i18n/i18n';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from './Components/login/LoginPage';
import RegisterOrg from './Components/Organisation/RegisterOrg';
import Otp from './Components/login/Otp';
import DashboardOrg from './Components/Organisation/DashboardOrg';
import Dashbord from './Components/Dashbord';
import OrgLayout from './Components/Organisation/OrgLayout';
import AddDept from './Components/Departement/AddDept';
import DisplayDept from './Components/Departement/DisplayDept';
import AddHR from './Components/HR/AddHR';
import DisplayHR from './Components/HR/DisplayHR';

function App() {

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, [])

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}
        />
        <Route path='/Login/:role' element={<LoginPage/>}
        />
        <Route path='/Register/Organisation' element={<RegisterOrg />}
        />
        <Route path='/Login/Otp' element={<Otp />}
        />
        <Route path='/Dashbord' element={<Dashbord />}
        />
        {/* ORG Layout with sidebar/nav */}
        <Route path="/Organisation/:orgID" element={<OrgLayout />}>
          <Route index element={<DashboardOrg />} />
          <Route path="Departement/Add" element={<AddDept />} />
          <Route path="Departements" element={<DisplayDept />} />
          <Route path="HR/Add" element={<AddHR />} />
          <Route path="HRs" element={<DisplayHR />} />
        </Route>
      </Routes>  
    </Router>
  );
}

export default App;
