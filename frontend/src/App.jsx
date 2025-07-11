import { useState } from 'react'
import './App.css'
import Home from "./Components/Home";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, [])

  return <Home />;
}

export default App;
