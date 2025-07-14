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
import DashboardOrg from './Components/Organisation/dashboardOrg';

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
        <Route path='/Organisation' element={<DashboardOrg />}
        />
      </Routes>  
    </Router>
  );
}

export default App;
