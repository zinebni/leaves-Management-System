import axios from 'axios';
import { CheckCircle, Hash, Mail, Phone, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditHR() {
  const {id} = useParams();
  const {t} = useTranslation();
  const [employee, setEmployee] = useState({});
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [familySitu, setFamilySitu] = useState('');
  const [childNumber, setChildNumber] = useState(null);
  const [error, setError] = useState({});
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const {orgID} = useParams();
  const navigate = useNavigate();

  const edit = async () => {
    let isValid = true;
    const newError = {};
    const regexPhoneMaroc = /^(06|07)[0-9]{8}$/;

    if(!email.trim()){
      isValid = false;
      newError.email = t('emailRequired');
    }
    if(childNumber && childNumber < 0) {
      isValid = false;
      newError.childNumber = t('invalid_child_number');
    }
    
    if (contact && !regexPhoneMaroc.test(contact)){
      isValid = false;
      newError.contact = t('invalid_phone_number');
    }

    if(!isValid){
      setError(newError);
      return;
    }

    setError({});
    const editInfo = {
      verificationEmail: email,
      numeroDeContact: contact,
      situationFamiliale: familySitu,
      nombreEnfants: childNumber
    };

    try{
      const res = await axios.put(`http://localhost:4000/api/employee/updateEmployeeById/${id}`, editInfo, {
        withCredentials: true
      });
      toast.success(t('rh_edited_success'), {
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
        navigate(`/Organisation/${orgID}/HRs`);
      }, (4000));
    } catch(error) {
      console.log(error);
    }
  }

  const fetchHR = async () => {
    try{
      const res = await axios.get(`http://localhost:4000/api/employee/getEmployeeById/${id}`, {
        withCredentials:true
      });

      setEmployee(res.data.employee);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchHR();
  }, []);

  useEffect(() => {
    if (employee) {
      setEmail(employee.verificationEmail || '');
      setContact(employee.numeroDeContact || '');
      setFamilySitu(employee.situationFamiliale || '');
      setChildNumber(employee.nombreEnfants || '');
    }
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
  }, [employee])

  return (
    <div className={`flex justify-center items-center mt-5 sm:mt-5 mb-5`}>
      <div className='bg-mediumBlue/60 dark:bg-blue-950/50 shadow-xl ring-1 ring-white/10  border-2 border-mediumBlue/50 w-fit flex flex-col items-center justify-center px-8 sm:px-10 py-5 sm:py-8 rounded-xl dark:border-none'>
        <div className='flex justify-start items-center w-full pl-5'>
          <p className="text-xl mb-5 font-bold text-gray-800 dark:text-gray-300">
            {employee.prenom} {employee.nom}
          </p>
        </div>
        <div className='grid grid-cols-1 gap-5'>
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
                  className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
                />
              </>
            </div>
            <p className='pl-5 text-red-700'>
              {error.email}
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
                className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
              >
                <option value="" disabled>{t('select_family_situation')}</option>
                <option value="célibataire">{t('single')}</option>
                <option value="marié(e)">{t('married')}</option>
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
                className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
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
                className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
              />
            </div>
            <p className='pl-5 text-red-700'>
              {error.childNumber}
            </p>
          </div>
        </div>
        <p className={`mb-5 text-base font-semibold ${statusMessage ? 'text-darkBlue' : 'text-red-600'}`}>
          {message}
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mt-8'>
          <button className='text-base sm:text-[17px] font-semibold bg-gray-700 hover:bg-gray-800 dark:bg-gray-400 dark:text-gray-900 dark:hover:bg-gray-300 py-2 text-white rounded-lg sm:rounded-lg mb-2 cursor-pointer'
            onClick={() => window.location.href = `/Organisation/${orgID}/HRs`}
          >
            {t('cancel')}
          </button>
          <button className='text-base sm:text-[17px] font-semibold bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700  py-2 text-white rounded-lg sm:rounded-lg mb-2 cursor-pointer hover:bg-blue-600'
            onClick={edit}
          >
            {t('edit')}
          </button>
        </div>
      </div>
      <ToastContainer theme={theme} />
    </div>
  )
}
