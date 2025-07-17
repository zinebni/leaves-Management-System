import axios from 'axios';
import { Calendar, CheckCircle, Hash, Mail, Phone, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddHR() {
  const {t} = useTranslation();
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [sexe, setSexe] = useState('');
  const [contact, setContact] = useState('');
  const [familySitu, setFamilySitu] = useState('');
  const [childNumber, setChildNumber] = useState(null);
  const [recruitmentDate, setRecruitmentDate] = useState(Date.now());
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
    const regexPhoneMaroc = /^(06|07)[0-9]{8}$/;

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

    if (!sexe) {
      isValid = false;
      newError.sexe = t('gender_required');
    }
    
    if (!regexPhoneMaroc.test(contact)){
      isValid = false;
      newError.contact = t('invalid_phone_number');
    }

    if(!isValid){
      setError(newError);
      return;
    }
    const rh = {
      nom: lastName,
      prenom: firstName,
      verificationEmail: email,
      sexe,
      numeroDeContact: contact,
      dateDeRecrutement: recruitmentDate,
      situationFamiliale: familySitu,
      nombreEnfants: childNumber
    };

    console.log(rh);

    try{
      setError({});
      const res = await axios.post('http://localhost:4000/api/auth/rhRegister', rh,
        {
          withCredentials: true
        }
      );
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
    <div className={`flex justify-center items-center mt-5 sm:mt-10`}>
        <div className='bg-lightBlue/60 dark:bg-blue-950/50 shadow-xl ring-1 ring-white/10  border-2 border-zinc-400 w-fit flex flex-col items-center justify-center px-5 sm:px-10 py-8 sm:py-10 rounded-2xl dark:border-none'>
        <h2 className='mb-8 font-semibold text-lg sm:text-xl dark:text-gray-200'>
          {t('add_rh_title')}
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          <div className='text-sm sm:text-[17px] w-3xs sm:w-xs'>
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
          <div className='text-sm sm:text-[17px] w-3xs sm:w-xs'>
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
          <div className='text-sm sm:text-[17px] w-3xs sm:w-xs'>
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
          <div className="text-sm sm:text-[17px] w-3xs sm:w-xs pl-5">
            <label className="block mb-3 font-medium text-gray-800 dark:text-gray-200">{t('gender')}</label>
            
            <div className="flex gap-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="sexe"
                  value="Homme"
                  checked={sexe === 'Homme'}
                  onChange={(e) => setSexe(e.target.value)}
                  className="accent-blue-600"
                />
                <span className="ml-2 text-gray-800 dark:text-gray-200">{t('male')}</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="sexe"
                  value="Femme"
                  checked={sexe === 'Femme'}
                  onChange={(e) => setSexe(e.target.value)}
                  className="accent-pink-600"
                />
                <span className="ml-2 text-gray-800 dark:text-gray-200">{t('female')}</span>
              </label>
            </div>
            <p className='pl-1 text-red-700'>
              {error.sexe}
            </p>
          </div>
          <div className="text-sm sm:text-[17px] w-3xs sm:w-xs">
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <User size={20} />
              </span>
              <select
                value={familySitu}
                onChange={(e) => setFamilySitu(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-2xl bg-zinc-200 border-gray-700 w-full text-gray-700"
              >
                <option value="">{t('select_family_situation')}</option>
                <option value="célibataire">{t('single')}</option>
                <option value="marié(e">{t('married')}</option>
                <option value="divorcé(e)">{t('divorced')}</option>
              </select>
            </div>
          </div>
          <div className='text-sm sm:text-[17px] w-3xs sm:w-xs'>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Phone size={20} />
              </span>
              <input 
                placeholder={t('contact_placeholder')}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-2xl bg-zinc-200 border-gray-700 w-full"
              />
            </div>
            <p className='pl-5 text-red-700'>
              {error.contact}
            </p>
          </div>
          <div className='text-sm sm:text-[17px] w-3xs sm:w-xs'>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Hash size={20} />
              </span>
              <input 
                type="number"
                placeholder={t('child_number_placeholder')}
                value={childNumber || ''}
                onChange={(e) => setChildNumber(Number(e.target.value))}
                className="pl-10 pr-4 py-3 rounded-2xl bg-zinc-200 border-gray-700 w-full"
              />
            </div>
          </div>
          <div className='text-sm sm:text-[17px] w-3xs sm:w-xs'>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Calendar size={20} />
              </span>
              <input 
                type="date"
                value={new Date(recruitmentDate).toISOString().split('T')[0]}
                onChange={(e) => setRecruitmentDate(new Date(e.target.value))}
                className="pl-10 pr-4 py-3 rounded-2xl bg-zinc-200 border-gray-700 w-full"
              />
            </div>
          </div>
        </div>
        <div className='flex justify-end w-full mt-8'>
          <button className='text-base sm:text-lg font-semibold bg-mediumBlue dark:bg-darkBlue dark:hover:bg-blue-900 w-3xs sm:w-xs py-2 text-white rounded-lg sm:rounded-xl mb-2 cursor-pointer hover:bg-darkBlue'
            onClick={add}
          >
            {t('add_rh')}
          </button>
        </div>
      </div>
      <ToastContainer theme={theme} />
    </div>
  )
}
