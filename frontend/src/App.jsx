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
import EditEmp from './Components/Emp/EditEmp';
import EmpLayout from './Components/Emp/EmpLayout';
import DashbordEmp from './Components/Emp/DashbordEmp';
import RequestLeave from './Components/Leaves/RequestLeave';
import HandleRequests from './Components/HR/HandleRequests';
import ReqDetails from './Components/HR/ReqDetails';
import EmpHistorForReq from './Components/HR/EmpHistorForReq';
import EmpEnChauv from './Components/HR/EmpEnChauv';
import EmpHistoric from './Components/Emp/EmpHistoric';
import ProcessedReq from './Components/HR/ProcessedReq';
import AddEvent from './Components/Event/AddEvent';
import DisplayEvent from './Components/Event/DisplayEvent';
import EditEvent from './Components/Event/EditEvent';

function App() {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
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
        <Route path='/Login/Otp/:role' element={<Otp />}
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
          <Route path='Employee/Add' element={<AddEmp />}/>
          <Route path='Employees' element={<DisplayEmp  />}/>
          <Route path='Employees/Edit/:id' element={<EditEmp />} />
          <Route path='Requests' element={<HandleRequests />} />
          <Route path="Requests/Details/:id" element={<ReqDetails />} />
          <Route path='Requests/Details/:id/Emp/Historic' element={<EmpHistorForReq />} />
          <Route path='Requests/Details/:id/dept' element={<EmpEnChauv />} />
          <Route path='Processed-Requests' element={<ProcessedReq />} />
          <Route path="Event/Add" element={<AddEvent />} />
          <Route path="Events" element={<DisplayEvent />} />
          <Route path="Events/Edit/:id" element={<EditEvent />} />
        </Route>
        {/* Employee Layout with sidebar/nav */}
        <Route path='/Employee/:orgID/:employeeId' element={<EmpLayout />}>
          <Route index element={<DashbordEmp />} />
          <Route path='Request-leave' element={<RequestLeave />} />
          <Route path='Historic' element={<EmpHistoric />} />
        </Route>
      </Routes>  
    </Router>
  );
}

export default App;
