import { AlertCircle, CheckCircle, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import api from '../../api';
import LanguageSwitcher from '../../i18n/LanguageSwitcher';
import WebSiteName from '../WebSiteName';

export default function ResetPassword() {
  const {role} = useParams();
  const {t} = useTranslation();
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [otp, setOtp] = useState('');
  const [password, setPassword]  = useState('');
  const [confirmed, setConfirmed] = useState('');
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState(true);
  const email = localStorage.getItem('email') || '';

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

  const resetPassword = async () =>  {
    let isValid = true;
    const newError = {};

    if (!otp.trim()){
      isValid = false;
      newError.otp = t("otpRequired");
    }
    if(!password.trim()){
      isValid = false;
      newError.password = t("passwordRequired");
    }
    if(!confirmed.trim()){
      isValid = false;
      newError.confirmed = t("confirmedPasswordRequired");
    } else if(password.trim() && password !== confirmed) {
      isValid = false;
      newError.confirmed = t("confirmedPasswordMismatch");
    }

    if(!isValid){
      setError(newError);
      return
    } 

    setError({});
    const newPassword = {
      email,
      otp,
      newpassword: password
    };

    try{
      const res = await api.post('/api/auth/reset-password', newPassword);
      toast.success(t('passwordResetSuccess'), {
        position: "top-center",           // Positionne le toast en haut et centré horizontalement
        autoClose: 3000,                  // Ferme automatiquement le toast après 3000 ms (3 secondes)
        hideProgressBar: true,           // Affiche la barre de progression (temps restant)
        closeOnClick: true,               // Ferme le toast si l’utilisateur clique dessus
        pauseOnHover: true,               // Met en pause la fermeture automatique si la souris survole le toast
        draggable: true,                  // Permet de déplacer le toast avec la souris
        progress: undefined,              // Laisse la progression automatique par défaut
        icon: <CheckCircle color="#2f51eb" />,
      });

      const user = {
        email,
        password
      };

      const resLogin = await api.post('/api/auth/login', user);
      if(role === resLogin.data.data.role){
        // 2. Call OTP API (token is sent automatically via cookie)
        const otpRes = await api.post('/api/auth/send-verify-otp', null);

        setTimeout(() => {
          navigate(`/Login/Otp/${role}`);
        }, 4000);
      } else {
          toast.error(t('access_denied'), {
            position: "top-center",           // Positionne le toast en haut et centré horizontalement
            autoClose: 3000,                  // Ferme automatiquement le toast après 3000 ms (3 secondes)
            hideProgressBar: true,           // Affiche la barre de progression (temps restant)
            closeOnClick: true,               // Ferme le toast si l’utilisateur clique dessus
            pauseOnHover: true,               // Met en pause la fermeture automatique si la souris survole le toast
            draggable: true,                  // Permet de déplacer le toast avec la souris
            progress: undefined,              // Laisse la progression automatique par défaut
            icon: <AlertCircle color="#2f51eb" />,
          });
      }
    } catch(error) {
      console.log(error);
      if(error.status === 400){
        setMessage(t('otpInvalid'));
        setStatusMessage(false);
      }
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
      <div className='flex justify-center items-center mt-10 sm:mt-15'>
        <div  className='bg-mediumBlue/50 border-2 border-mediumBlue/60 w-fit flex flex-col items-center justify-center px-5 sm:px-10 py-10 rounded-xl'
        onKeyDown={(e) => {
          if (e.key === 'Enter') resetPassword();
        }}
        tabIndex="0"> {/* nécessaire pour que le div puisse capter les touches */}
        <h2 className='mb-8 font-bold text-xl sm:text-[22px] text-gray-800'>
          {t("reset_password")}
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
            <>
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <ShieldCheck size={20} />
              </span>
              <input 
                placeholder={t("otpPlaceholder")}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-lg bg-zinc-200 border-2 border-mediumBlue w-full outline-none focus:border-gray-700 "
              />
            </>
          </div>
          <p className='pl-5 text-red-700'>
            {error.otp}
          </p>
        </div>
        <div className='text-base text-[17px] w-3xs sm:w-xs mb-5'>
          <div className="relative  mb-2">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              <LockKeyhole size={20} />
            </span>
            <input 
              placeholder={t("passwordPlaceholder")}
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-lg bg-zinc-200 border-2 border-mediumBlue w-full outline-none focus:border-gray-700 "
            />
          </div>
          <p className='pl-5 text-red-700'>
            {error.password}
          </p>
        </div>
        <div className='text-base text-[17px] w-3xs sm:w-xs mb-5'>
          <div className="relative  mb-2">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              <LockKeyhole size={20} />
            </span>
            <input 
              placeholder={t("confirmedPasswordPlaceholder")}
              type='password'
              value={confirmed}
              onChange={(e) => setConfirmed(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-lg bg-zinc-200 border-2 border-mediumBlue w-full outline-none focus:border-gray-700 "
            />
          </div>
          <p className='pl-5 text-red-700'>
            {error.confirmed}
          </p>
        </div>
        <p className={`mb-5 text-base font-semibold ${statusMessage ? 'text-darkBlue' : 'text-red-600'}`}>
          {message}
        </p>
        <button className='text-base sm:text-lg font-semibold bg-mediumBlue w-3xs sm:w-xs py-2 text-white rounded-lg mb-2 cursor-pointer hover:bg-blue-600'
          onClick={resetPassword}
        >
          {t("reset")}
        </button>

      </div>
      </div>
      <ToastContainer />
    </div>
  )
}
