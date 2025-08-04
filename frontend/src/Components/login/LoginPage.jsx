import axios from 'axios';
import { Building2, CheckCircle, LockKeyhole, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import LanguageSwitcher from '../../i18n/LanguageSwitcher';
import WebSiteName from '../WebSiteName';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const {role} = useParams();
  const {t} = useTranslation();
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword]  = useState('');
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState(true);

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

    if (!email.trim()){
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
    if(role === 'Organisation'){
      const org = {
        email,
        password
      };

      try {
        const res = await axios.post('http://localhost:4000/api/auth/orgLogin', org, {
          withCredentials: true
        });
        const orgID = res.data.orgID;
        setMessage(t('loginSuccess'));
        setStatusMessage(true);
        setTimeout(() => { 
          navigate(`/Organisation/${orgID}`);
        }, 2000);
      } catch (error) {
        setMessage(t('invalidCredentials'));
        setStatusMessage(false);
      }
   } else {
          const user = {
            email,
            password
          };
            try {
            // 1. Login: Set token in HTTP-only cookie
            const res = await axios.post('http://localhost:4000/api/auth/login', user, {
              withCredentials: true
            });
            if(role === res.data.data.role){
              setMessage(t('login_success'));
              setStatusMessage(true);

              // 2. Call OTP API (token is sent automatically via cookie)
              const otpRes = await axios.post('http://localhost:4000/api/auth/send-verify-otp', null, {
                withCredentials: true
              });

              setTimeout(() => {
                navigate(`/Login/Otp/${role}`);
              }, 2000);
            } else {
                toast.success(t('access_denied'), {
                  position: "top-center",           // Positionne le toast en haut et centré horizontalement
                  autoClose: 3000,                  // Ferme automatiquement le toast après 3000 ms (3 secondes)
                  hideProgressBar: true,           // Affiche la barre de progression (temps restant)
                  closeOnClick: true,               // Ferme le toast si l’utilisateur clique dessus
                  pauseOnHover: true,               // Met en pause la fermeture automatique si la souris survole le toast
                  draggable: true,                  // Permet de déplacer le toast avec la souris
                  progress: undefined,              // Laisse la progression automatique par défaut
                  icon: <CheckCircle color="#2f51eb" />,
                });
                setTimeout(() => {
                    navigate(-1);
                }, 3500);
            }

          } catch (error) {
            console.error("Login or OTP failed:", error?.response?.data || error.message);
            if(error.status === 401) {
              setMessage(t('invalid_info'));
              setStatusMessage(false);
            }
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
      <div className='flex justify-center items-center mt-15 sm:mt-20'>
        <div  className='bg-mediumBlue/50 border-2 border-mediumBlue/60 w-fit flex flex-col items-center justify-center px-5 sm:px-10 py-10 rounded-xl'
        onKeyDown={(e) => {
          if (e.key === 'Enter') login();
        }}
        tabIndex="0"> {/* nécessaire pour que le div puisse capter les touches */}
        <h2 className='mb-8 font-bold text-[22px] text-gray-800'>
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
            <>
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Mail size={20} />
              </span>
              <input 
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-lg bg-zinc-200 border-2 border-mediumBlue w-full outline-none focus:border-gray-700 "
              />
            </>
          </div>
          <p className='pl-5 text-red-700'>
            {error.email}
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
              className="pl-10 pr-4 py-3 rounded-lg bg-zinc-200 border-2 border-mediumBlue w-full outline-none focus:border-gray-700 "
            />
          </div>
          <p className='pl-5 text-red-700'>
            {error.password}
          </p>
        </div>
        <p className={`mb-5 text-base font-semibold ${statusMessage ? 'text-darkBlue' : 'text-red-600'}`}>
          {message}
        </p>
        <button className='text-base sm:text-lg font-semibold bg-mediumBlue w-3xs sm:w-xs py-2 text-white rounded-lg mb-2 cursor-pointer hover:bg-blue-600'
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
      <ToastContainer />
    </div>
  )
}
