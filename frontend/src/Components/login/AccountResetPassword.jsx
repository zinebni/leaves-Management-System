import axios from 'axios';
import { CheckCircle, LockKeyhole, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AccountResetPassword() {

  const {t} = useTranslation();
  const [otp, setOtp] = useState('');
  const [password, setPassword]  = useState('');
  const [confirmed, setConfirmed] = useState('');
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState(true);
  const email = localStorage.getItem('email') || '';
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // Crée un nouvel observateur qui surveille les changements sur l'attribut 'class' de l'élément HTML <html>
    const observer = new MutationObserver(() => {
      // Récupère la classe actuelle de <html> (soit "light", "dark", etc.)
      const htmlTheme = document.documentElement.className;

      // Met à jour le state React 'theme' (ex: "dark" ou "light")
      // Si aucune classe n'est trouvée, on garde 'light' par défaut
      setTheme(htmlTheme || 'light');
    });

    // Lance l'observateur : on demande à observer les changements d'attributs sur <html>
    observer.observe(document.documentElement, {
      attributes: true,              // On veut écouter les changements d'attributs
      attributeFilter: ['class'],   // Mais uniquement si c’est l’attribut "class" qui change
    });

    // Cette fonction de retour sera exécutée lorsque le composant est démonté
    // Elle permet d'arrêter l'observation pour éviter des fuites mémoire
    return () => observer.disconnect();

  }, []);

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
      const res = await axios.post('http://localhost:4000/api/auth/reset-password', newPassword);
      toast.success(t('password_changed_successfully'), {
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
      }, 4000);
    } catch(error) {
      console.log(error);
      if(error.status === 400){
        setMessage(t('otpInvalid'));
        setStatusMessage(false);
      }
    }

  }

  return (
    <div>
      <div className='flex justify-center items-center mt-8 sm:mt-10'>
        <div  className='bg-gray-100 dark:bg-blue-950/50 rounded-lg py-6 px-8 shadow-xl border-2 border-mediumBlue dark:border-blue-200'
        onKeyDown={(e) => {
          if (e.key === 'Enter') resetPassword();
        }}
        tabIndex="0"> {/* nécessaire pour que le div puisse capter les touches */}
        <h2 className='mb-8 font-bold text-xl sm:text-[22px] text-blue-700 dark:text-blue-200 text-center'>
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
                className="pl-10 pr-4 py-3 rounded-lg bg-zinc-100 border-2 border-mediumBlue w-full outline-none focus:border-gray-700 "
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
              className="pl-10 pr-4 py-3 rounded-lg bg-zinc-100 border-2 border-mediumBlue  w-full outline-none focus:border-gray-700 "
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
              className="pl-10 pr-4 py-3 rounded-lg bg-zinc-100 border-2 border-mediumBlue w-full outline-none focus:border-gray-700 "
            />
          </div>
          <p className='pl-5 text-red-700'>
            {error.confirmed}
          </p>
        </div>
        <p className={`mb-5 text-base font-semibold text-center ${statusMessage ? 'text-darkBlue' : 'text-red-600'}`}>
          {message}
        </p>
        <button className='text-base sm:text-lg  w-3xs sm:w-xs  mb-2  px-4 py-2 rounded-lg bg-mediumBlue text-white dark:bg-blue-200 dark:text-blue-950 hover:opacity-90 transition font-semibold cursor-pointer'
          onClick={resetPassword}
        >
          {t("reset")}
        </button>

      </div>
      </div>
      <ToastContainer theme={theme}/>
    </div>
  )
}
