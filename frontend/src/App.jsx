import { useState } from 'react'
import './App.css';
import './i18n/i18n';
import Home from "./Components/Home";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from './Components/login/LoginPage';
import RegisterOrg from './Components/Organisation/RegisterOrg';
import Otp from './Components/login/Otp';
import DashboardOrg from './Components/Organisation/DashboardOrg';
import Dashbord from './Components/HR/DashbordHR';
import OrgLayout from './Components/Organisation/OrgLayout';
import AddDept from './Components/Departement/AddDept';
import DisplayDept from './Components/Departement/DisplayDept';
import AddHR from './Components/HR/AddHR';
import DisplayHR from './Components/HR/DisplayHR';
import EditHR from './Components/HR/EditHR';
import HRLayout from './Components/HR/HRLayout';
import DashbordHR from './Components/HR/DashbordHR';
import AddEmp from './Components/Emp/AddEmp';
import DisplayEmp from './Components/Emp/DisplayEmp';

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
          <Route path="HRs/Edit/:id" element={<EditHR />} />
        </Route>
        {/* HR Layout with sidebar/nav */}
        <Route path="/HR/:orgID" element={<HRLayout />}>
          <Route index element={<DashbordHR />} />
          <Route path='Employees/Add' element={<AddEmp />}/>
          <Route path='Employees' element={<DisplayEmp  />}/>
        </Route>
      </Routes>  
    </Router>
  );
}

export default App;
