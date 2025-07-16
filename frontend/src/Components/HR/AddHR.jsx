import axios from 'axios';
import { CheckCircle, Mail, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddHR() {
  const {t} = useTranslation();
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState({});

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

  const add = async () => {
    let isValid = true;
    const newError = {};

    if(!lastName.trim()){
      isValid = false;
      newError.lastName = t('last_name_required');
    }
    if(!firstName.trim()){
      isValid = false;
      newError.firstName = t('first_name_required')
    }
    if(!email.trim()){
      isValid = false;
      newError.email = t('emailRequired');
    }

    const rh = {
      nom: lastName,
      prenom: firstName,
      verificationEmail: email
    };

    if(!isValid){
      setError(newError);
      return;
    }

    try{
      /* const res = await axios.post('http://localhost:4000/api/department/createDepartment', rh,
        {
          withCredentials: true
        }
      ); */
      setLastName('');
      setFirstName('');
      setEmail('');
      toast.success(t('rhAddSuccess'), {
        position: "top-center",           // Positionne le toast en haut et centré horizontalement
        autoClose: 3000,                  // Ferme automatiquement le toast après 3000 ms (3 secondes)
        hideProgressBar: true,           // Affiche la barre de progression (temps restant)
        closeOnClick: true,               // Ferme le toast si l’utilisateur clique dessus
        pauseOnHover: true,               // Met en pause la fermeture automatique si la souris survole le toast
        draggable: true,                  // Permet de déplacer le toast avec la souris
        progress: undefined,              // Laisse la progression automatique par défaut
        icon: <CheckCircle color="#2f51eb" />,
      });
    } catch(error){
      console.log(error);
    }
    
  }

  return (
    <div className={`flex justify-center items-center mt-20 sm:mt-25`}>
        <div className='bg-lightBlue/60 dark:bg-blue-950/90 shadow-xl ring-1 ring-white/10  border-2 border-zinc-400 w-fit flex flex-col items-center justify-center px-5 sm:px-10 py-8 sm:py-10 rounded-2xl dark:border-none'>
        <h2 className='mb-8 font-semibold text-lg sm:text-xl dark:text-gray-200'>
          {t('add_rh_title')}
        </h2>
        <div className='text-sm sm:text-[17px] w-3xs sm:w-xs mb-4'>
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
                <User size={20} />
              </span>
              <input 
                placeholder={t('last_name_placeholder')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl sm:rounded-2xl bg-zinc-200 border-gray-700 w-full"
              />
            </>
          </div>
          <p className='pl-5 text-red-700'>
            {error.lastName}
          </p>
        </div>
        <div className='text-sm sm:text-[17px] w-3xs sm:w-xs mb-4'>
          <div className="relative  mb-2">
            <span className="absolute left-3 pt-4 text-gray-600">
              <User size={20} />
            </span>
            <input 
              placeholder={t('first_name_placeholder')}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl sm:rounded-2xl bg-zinc-200 border-gray-700 w-full"
            />
          </div>
          <p className='pl-5 text-red-700'>
            {error.firstName}
          </p>
        </div>
        <div className='text-sm sm:text-[17px] w-3xs sm:w-xs mb-10'>
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
                className="pl-10 pr-4 py-3 rounded-2xl bg-zinc-200 border-gray-700 w-full"
              />
            </>
          </div>
          <p className='pl-5 text-red-700'>
            {error.email}
          </p>
        </div>
        <button className='text-base sm:text-lg font-semibold bg-mediumBlue dark:bg-mediumBlue/70 dark:hover:bg-mediumBlue w-3xs sm:w-xs py-2 text-white rounded-lg sm:rounded-xl mb-2 cursor-pointer hover:bg-darkBlue'
          onClick={add}
        >
          {t('add_rh')}
        </button>
      </div>
      <ToastContainer theme={theme} />
    </div>
  )
}
