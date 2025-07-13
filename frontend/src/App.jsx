import { useState } from 'react'
import './App.css'
import Home from "./Components/Home";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import './i18n/i18n';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import RegisterOrg from './Components/Organisation/RegisterOrg';

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
      </Routes>  
    </Router>
  );
}

export default App;
