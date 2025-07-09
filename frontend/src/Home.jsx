import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import logo from './assets/Logo/Logo_without_BG.png';
import { MoveRight } from 'lucide-react';

function Home() {
  const vantaRef = useRef(null); //  is a React ref to the <div> where the Vanta animation will appear.
  const [vantaEffect, setVantaEffect] = useState(null); //holds the instance of the Vanta animation effect so you can destroy it when the component unmounts.
  const slogan = 'Faciliter vos congés, valoriser votre temps en toute transparence';

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,   // the element to attach the animation to
          THREE: THREE,           // Passes the Three.js libary to Vanta
          color: 0x2c3e50,         // Deep urban blue for lines
          backgroundColor: 0xecf0f1, // Light gray background (like concrete)
          points: 15.0,            // How many points are generated.
          maxDistance: 28.0,       // Lines max length
          spacing: 22.0,           // Distance between points
          showDots: true,          //  Whether to display the dots/nodes.
          dotColor: 0x34495e,      // Darker blue for dots
          mouseControls: true,     // Interactive with mouse
          touchControls: true,      // Interactive with touch
          gyroControls: false,      // Don’t move the background when the user tilts the phone.
          minHeight: 200.0,
          minWidth: 200.0, //Minimum size for the animation to activate.
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="w-full h-screen relative overflow-hidden"
    >
      <div className="px-5 sm:px-10 py-5 flex justify-between">
        <img src={logo} 
          className="w-16"
        />
        <button className="flex items-center gap-2  px-4 py-1 rounded-2xl font-semibold bg-lightBlue text-lg border-2 border-gray-600">
          Login 
          <MoveRight />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center h-full px-4">
        <img src={logo} className="w-28 mb-6" />

        <h1 className="text-3xl font-bold mb-5 text-center">Bienvenue sur notre plateforme</h1>

        <p className="text-xl font-semibold text-gray-700 mb-3 text-center">
          {slogan}
        </p>

        <p className="text-center text-gray-600 max-w-md mb-10">
          Gérer les congés facilement et en toute transparence, pour les employés et les RH.
        </p>

        <div className="flex gap-4">
          <button className="px-5 py-2 rounded-2xl text-lg border-2 border-gray-600 hover:bg-gray-100">
            Espace Employé
          </button>
          <button className="px-5 py-2 rounded-2xl text-lg border-2 border-mediumBlue text-mediumBlue hover:bg-blue-50">
            Espace RH
          </button>
        </div>

        <footer className="mt-16 text-sm text-gray-600">
          © 2025 – Plateforme de gestion des congés conforme au cadre légal marocain
        </footer>
      </div>

    </div>
  );
}

export default Home;
