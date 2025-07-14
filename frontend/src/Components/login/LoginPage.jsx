import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom'
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min'
import LanguageSwitcher from '../../i18n/LanguageSwitcher';
import { User, Building2, LockKeyhole } from 'lucide-react';
import WebSiteName from '../WebSiteName';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const {role} = useParams();
  const {t} = useTranslation();
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [email, setEmail] = useState('');
  const [orgId, setOrgId] = useState('');
  const [password, setPassword]  = useState('');
  const [error, setError] = useState({});

  useEffect(() => {
    if(!vantaEffect){
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
          minWidth: 200.0, 

        })
      )
    }
  },[]);

  const login = async () =>  {
    let isValid = true;
    const newError = {};

    if(role === 'Organisation' && !orgId.trim()){
      isValid = false;
      newError.orgId = t("orgIDRequired");
    }
    else if (role !== 'Organisation' && !email.trim()){
      isValid = false;
      newError.email = t("emailRequired");
    }
    if(!password.trim()){
      isValid = false;
      newError.password = t("passwordRequired");
    }

    if(!isValid){
      setError(newError);
      return
    } 

    setError({});
    const user = {
      email,
      password
    };

    try{
      const res = await axios.post(
        'http://127.0.0.1:4000/api/auth/login',
        user,
  { withCredentials: true } // ✅ THIS IS REQUIRED
      );

      const otp = await axios.post('http://localhost:4000/api/auth/send-verify-otp', null, {
  withCredentials: true
});


      console.log(otp);
      console.log(res);
    }  catch (error) {
        console.log(error);
    }

  }

  return (
    <div ref={vantaRef}
        className='w-full h-screen overflow-hidden relative '
    >
      <div className="px-5 sm:px-10 py-5 flex justify-between items-center">
        <WebSiteName />
        <LanguageSwitcher />
      </div>
      <div className='flex justify-center items-center mt-20 sm:mt-25'>
        <div className='bg-lightBlue/60 border-2 border-zinc-600 w-fit flex flex-col items-center justify-center px-5 sm:px-10 py-10 rounded-2xl'>
        <h2 className='mb-8 font-semibold text-xl'>
          {t("login")}
        </h2>
        <div className='text-base sm:text-[17px] w-3xs sm:w-xs mb-4'>
          {/* relative: This makes the container a reference point for absolutely positioning elements inside it. */}
          <div className="relative mb-2">
            {/* 
                *top-1/2 sets the top edge of the icon to 50% of the height of its container.
                *But that puts the top edge in the middle — so the icon appears slightly lower than centered.
                *-translate-y-1/2 shifts the icon up by 50% of its own height, which repositions it to be truly centered.
                * the first - in translate mean negative
             */}
            {role === 'Organisation' ?
              <>
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                  <Building2 size={20} />
                </span>
                <input 
                  placeholder={t("orgIDPlaceholder")}
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-2xl bg-zinc-200 border-gray-700 w-full"
                /> 
              </>: 
              <>
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                  <User size={20} />
                </span>
                <input 
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-2xl bg-zinc-200 border-gray-700 w-full"
                />
              </>
            }
          </div>
          <p className='pl-5 text-red-700'>
            {role === 'Organisation' ? error.orgId : error.email}
          </p>
        </div>
        <div className='text-base text-[17px] w-3xs sm:w-xs mb-10'>
          <div className="relative  mb-2">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              <LockKeyhole size={20} />
            </span>
            <input 
              placeholder={t("passwordPlaceholder")}
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-2xl bg-zinc-200 border-gray-700 w-full"
            />
          </div>
          <p className='pl-5 text-red-700'>
            {error.password}
          </p>
        </div>
        <button className='text-base sm:text-lg font-semibold bg-mediumBlue w-3xs sm:w-xs py-2 text-white rounded-xl mb-2 cursor-pointer hover:bg-darkBlue'
          onClick={login}
        >
          {t("login")}
        </button>
        {
          role === 'Organisation' && (
            <p className="mt-4 text-base text-gray-800">
              {t("noAccount")} <a href="/Register/Organisation" className="text-mediumBlue underline hover:text-darkBlue">{t("register")}</a>
            </p>
          )
        }

      </div>
      </div>
      
    </div>
  )
}
