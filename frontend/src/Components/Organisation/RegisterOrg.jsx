import React, { use, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import WebSiteName from '../WebSiteName';
import LanguageSwitcher from '../../i18n/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Building2, FileText, LockKeyhole } from 'lucide-react';


export default function RegisterOrg() {
  const vantaRef = useRef(null)
  const [vantaEffect, setVantaEffect] = useState(null);
  const {t} = useTranslation();

  const [orgId, setOrgId] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const [error, setError] = useState({});

  useEffect(() => {
    if(!vantaEffect){
      setVantaEffect(
        NET({
          el: vantaRef.current,
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
    }

  },[]);

  const register = () => {

    let isValid = true;
    const newError = {};

    if(!orgId.trim()){
      isValid = false;
      newError.orgId = t("orgIDRequired");
    }
    if(!password.trim()){
      isValid = false;
      newError.password = t("passwordRequired");
    } 

    if(!confirmedPassword.trim()){
      isValid = false;
      newError.confirmedPassword = t("confirmedPasswordRequired");
    } else if(password.trim() && password !== confirmedPassword) {
      isValid = false;
      newError.confirmedPassword = t("confirmedPasswordMismatch");
    }

    if(!isValid){
      setError(newError);
    } else {
      setError({});
    }
  }

  return (
    <div ref={vantaRef}
          className='w-full h-screen overflow-hidden relative'
    >
      <div className="px-5 sm:px-10 py-5 flex justify-between items-center">
        <WebSiteName />
        <LanguageSwitcher />
      </div>
      <div className='flex justify-center items-center mt-2'>
        <div className='bg-lightBlue/60 border-2 border-zinc-600 w-fit flex flex-col items-center justify-center px-6 sm:px-10 py-7 rounded-2xl'>
          <h2 className='mb-8 font-semibold text-xl'>
            {t("register")}
          </h2>
          <div className='text-base sm:text-[17px] mb-3'>
            {/* relative: This makes the container a reference point for absolutely positioning elements inside it. */}
            <div className="relative w-3xs sm:w-xs mb-2">
              {/* 
                  *top-1/2 sets the top edge of the icon to 50% of the height of its container.
                  *But that puts the top edge in the middle — so the icon appears slightly lower than centered.
                  *-translate-y-1/2 shifts the icon up by 50% of its own height, which repositions it to be truly centered.
                  * the first - in translate mean negative
              */}
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Building2 size={20} />
              </span>
              <input 
                placeholder={t("orgIDPlaceholder")}
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-2xl bg-zinc-200 border-gray-700 w-full"
              /> 
            </div>
            <p className='pl-5 text-red-700'>
              {error.orgId}
            </p>
          </div>
          <div className='text-base sm:text-[17px] mb-3'>
            <div className="relative w-3xs sm:w-xs mb-2">
              <span className="absolute left-3 pt-4 text-gray-600">
                <FileText size={20} />
              </span>
              <textarea 
                placeholder={t("descriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-2xl bg-zinc-200 border-gray-700 w-full"
              /> 
            </div>
            <p className='pl-5 text-red-700'>
              {error.description}
            </p>
          </div>
          <div className='text-base sm:text-[17px] mb-3'>
            <div className="relative w-3xs sm:w-xs mb-2">
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
          <div className='text-base sm:text-[17px] mb-6'>
            <div className="relative w-3xs sm:w-xs mb-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <LockKeyhole size={20} />
              </span>
              <input 
                placeholder={t("confirmedPasswordPlaceholder")}
                type='password'
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-2xl bg-zinc-200 border-gray-700 w-full"
              />
            </div>
            <p className='pl-5 text-red-700'>
              {error.confirmedPassword}
            </p>
          </div>
          <button className='text-base sm:text-lg font-semibold bg-mediumBlue w-3xs sm:w-xs py-2 text-white rounded-xl mb-2 cursor-pointer hover:bg-darkBlue'
            onClick={register}
          >
            {t("register")}
          </button>
          <p className="mt-2 text-base text-gray-800">
            {t("alreadyHaveAccount")}{" "}
            <a href="/login/Organisation" className="text-mediumBlue underline hover:text-darkBlue">
              {t("login")}
            </a>
          </p>

        </div>
      </div>
    </div>
  )
}
