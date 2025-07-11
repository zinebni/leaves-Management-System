import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import logo from '../assets/Logo/Logo_without_BG.png';
import { MoveRight } from 'lucide-react';
import WebSiteName from "./WebSiteName";
import LanguageSwitcher from "../i18n/LanguageSwitcher";
import { useTranslation } from "react-i18next";

function Home() {
  const vantaRef = useRef(null); //  is a React ref to the <div> where the Vanta animation will appear.
  const [vantaEffect, setVantaEffect] = useState(null); //holds the instance of the Vanta animation effect so you can destroy it when the component unmounts.
  const slogan = 'Faciliter vos congés, valoriser votre temps en toute transparence';
  const {t} = useTranslation();

  useEffect(() => {
    if(!vantaEffect) {
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
          mouseControls: true,     // Interactive with mouse
          touchControls: true,      // Interactive with touch
          gyroControls: false,      // Don’t move the background when the user tilts the phone.
          minHeight: 200.0,
          minWidth: 200.0, //Minimum size for the animation to activate.
        })
      )      
    }   

    return () => {
      vantaEffect && vantaEffect.destroy();
    };
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "theme") {
        setTheme(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div
      ref={vantaRef}
      className="w-full h-screen relative overflow-hidden dark:text-white"
    >
      <div className="px-5 sm:px-10 py-5 flex justify-between items-center">
        <WebSiteName />
        <div className="flex items-center gap-2 sm:gap-5">
          <button className="flex items-center gap-2 px-4 sm:px-5 py-1 sm:py-2 rounded-2xl font-semibold bg-lightBlue text-lg border-2 border-gray-600 cursor-pointer hover:bg-lightBlue/70 duration-500">
            {t('explore')}
            <MoveRight />
          </button>
          <LanguageSwitcher />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <img src={logo} className="w-28 mb-6"  />

        <h1 className="text-3xl font-bold mb-4">
          {t('headline')}
        </h1>

        <p className="text-lg text-gray-700 mb-6 max-w-xl">
          {t('subheadline')}
        </p>

        {/* Call to Action - Organisation */}
        <button
          onClick={() => window.location.href = '/register-organisation'}
          className="px-6 py-3 mb-8 rounded-2xl text-lg bg-mediumBlue text-white  cursor-pointer shadow-md
                      hover:bg-darkBlue hover:scale-105 duration-500
                    "
        >
          {t('createAccount')}
        </button>

        {/* Already have an account */}
        <div className="mt-3 text-lg text-gray-700">
          <p className="mb-6">{t('alreadyHaveAccount')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="px-4 py-2 border border-gray-500 rounded font-semibold cursor-pointer hover:bg-mediumBlue hover:text-white hover:border-none duration-500"
            >
              {t('loginOrganization')}
            </button>
            <button
              className="px-4 py-2 border border-gray-500 rounded font-semibold cursor-pointer hover:bg-mediumBlue hover:text-white hover:border-none duration-500"
            >
              {t('loginRH')}
            </button>
            <button
              className="px-4 py-2 border border-gray-500 rounded font-semibold  cursor-pointer hover:bg-mediumBlue hover:text-white hover:border-none duration-500"
            >
              {t('loginEmployee')}
            </button>
          </div>
        </div>
        <p className="mt-10  text-gray-600">
          {t('footer')}
        </p>
      </div>
    </div>
  );
}

export default Home;
