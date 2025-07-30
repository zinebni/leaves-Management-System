import React, { use, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import WebSiteName from '../WebSiteName';
import LanguageSwitcher from '../../i18n/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Mail, Building2, FileText, LockKeyhole } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function RegisterOrg() {
  const vantaRef = useRef(null)
  const [vantaEffect, setVantaEffect] = useState(null);
  const {t} = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState({});
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState(true);

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

  const register = async () => {

    let isValid = true;
    const newError = {};

    if(!email.trim()){
      isValid = false;
      newError.email = t("emailRequired");
    }

    if(!name.trim()){
      isValid = false;
      newError.name = t("orgNameRequired");
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
      return;
    } 

    setError({});
    const organisation = {
      email,
      nom: name,
      description,
      password
    };

    try{
      const res = await axios.post('http://localhost:4000/api/auth/orgRegister', organisation);
      if(res.status === 201){
        setMessage(t('orgAccountCreated'));
        setStatusMessage(true);
        const org = {
          email,
          password
        };
        //login
        try {
          const res = await axios.post('http://localhost:4000/api/auth/orgLogin', org, {
            withCredentials: true
          });
          const orgID = res.data.orgID;
          setTimeout(async () => {
            navigate(`/Organisation/${orgID}`);
          }, 3000);
        } catch (error) {
          console.error("Login failed:", error?.response?.data || error.message);
        }
      } else {
        setMessage(t('emailAlreadyExists'));
        setStatusMessage(false);
      }

    }catch(error){
      console.log(error);
    }
  }

  return (
    /*
      Stacking order by z-index (from back to front):

      z-index: -3  → behind everything (even behind -2)
      z-index: -2  → behind everything except -3
      z-index: -1  → behind default layer and positive z-indexes
      z-index: 0   → default layer (normal content)
      z-index: 1   → in front of 0
      z-index: 2   → in front of 1
      z-index: 3   → in front of 2
      ... and so on, higher numbers stack above lower ones
    */
    <div className='relative w-full min-h-screen overflow-y-auto'>
      <div
        ref={vantaRef}
        className='fixed top-0 left-0 w-full h-full -z-10'
      />
      <div className="px-5 sm:px-10 py-5 flex justify-between items-center">
        <WebSiteName />
        <LanguageSwitcher />
      </div>
      <div className='flex justify-center items-center mt-1'>
        <div className='bg-mediumBlue/50 border-2 border-mediumBlue/60 w-fit flex   flex-col items-center justify-center px-5 sm:px-10 py-7 rounded-xl'
          onKeyDown={(e) => {
            if (e.key === 'Enter') register();
          }}
          tabIndex="0"
        >
          <h2 className='mb-5 font-bold text-[21px] text-gray-800'>
            {t("register")}
          </h2>
          <div className='text-base sm:text-[17px] w-3xs sm:w-xs mb-3'>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Mail size={20} />
              </span>
              <input 
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-lg bg-zinc-200 border-2 border-mediumBlue w-full outline-none focus:border-gray-700"
              /> 
            </div>
            <p className='pl-5 text-red-700'>
              {error.email}
            </p>
          </div>
          <div className='text-base sm:text-[17px] w-3xs sm:w-xs mb-3'>
            {/* relative: This makes the container a reference point for absolutely positioning elements inside it. */}
            <div className="relative mb-2">
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
                placeholder={t("orgNamePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-lg bg-zinc-200 border-2 border-mediumBlue w-full outline-none focus:border-gray-700"
              /> 
            </div>
            <p className='pl-5 text-red-700'>
              {error.name}
            </p>
          </div>
          <div className='text-base sm:text-[17px] w-3xs sm:w-xs mb-3'>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/8 transform  text-gray-600">
                <FileText size={20} />
              </span>
              <textarea 
                placeholder={t("descriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-zinc-200 border-2 border-mediumBlue w-full outline-none focus:border-gray-700"
              /> 
            </div>
            <p className='pl-5 text-red-700'>
              {error.description}
            </p>
          </div>
          <div className='text-base sm:text-[17px] w-3xs sm:w-xs mb-3'>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <LockKeyhole size={20} />
              </span>
              <input 
                placeholder={t("passwordPlaceholder")}
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-lg bg-zinc-200 border-2 border-mediumBlue w-full outline-none focus:border-gray-700"
              />
            </div>
            <p className='pl-5 text-red-700'>
              {error.password}
            </p>
          </div>
          <div className='text-base sm:text-[17px] w-3xs sm:w-xs mb-3'>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <LockKeyhole size={20} />
              </span>
              <input 
                placeholder={t("confirmedPasswordPlaceholder")}
                type='password'
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-lg bg-zinc-200 border-2 border-mediumBlue w-full outline-none focus:border-gray-700"
              />
            </div>
            <p className='pl-5 text-red-700'>
              {error.confirmedPassword}
            </p>
          </div>
          <p className={`mb-5 text-base font-semibold ${statusMessage ? 'text-darkBlue' : 'text-red-600'}`}>
            {message}
          </p>
          <button className='text-base sm:text-lg font-semibold bg-mediumBlue w-3xs sm:w-xs py-2 text-white rounded-lg mb-2 cursor-pointer hover:bg-blue-600'
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
