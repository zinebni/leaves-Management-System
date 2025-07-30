import axios from 'axios';
import { CheckCircle, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EmpHistoric() {

  const [historic, setHistoric] = useState([]);
  const [hrs, setHrs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const {t} = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [filterBy, setFilterBy] = useState('');
  const [type, setType] = useState('annuel');
  const [status, setStatus] = useState('approved');
  const [date, setDate] = useState('');
  let delay = 0;


  const fetchHistoric = async () => {
    try{
      const res = await axios.get('http://localhost:4000/api/conge/getMyLeaveRequests', {
        withCredentials: true
      });
      const historicData = res.data.conges.reverse();
      setHistoric(historicData);
      console.log(historicData);

      const hrIds = [
        ...new Set(
          historicData
          .flatMap(item => [item.approuvePar, item.refusePar])
          .filter(Boolean)
        )
      ];

      if(hrIds.length > 0) {
        const hrData = {}
        await Promise.all(
          hrIds.map(async (hrId) => {
            const hrRes = await axios.get(`http://localhost:4000/api/employee/getEmployeeById/${hrId}`, {
              withCredentials: true
            });
            hrData[hrId] = hrRes.data.employee;
          })
        )
        setHrs(hrData);
      }
    } catch(error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  const filterLeaves =
    (filterBy === 'type' && type)
      ? historic.filter(item => item.motif.type === type)
      : (filterBy === 'status' && status)
      ? historic.filter(item =>
          status === 'approved' ? item.approuvePar :
          status === 'rejected' ? item.refusePar : null
        )
      : (filterBy === 'date' && date)
      ? historic.filter(item =>
          new Date(item.date_debut).toDateString() === new Date(date).toDateString() ||
          new Date(item.date_fin).toDateString() === new Date(date).toDateString()
        )
      : historic;


  const cancelReq = async (id) => {
    const confirm = window.confirm(t('confirm_cancel'));
    if(!confirm){
      return;
    }

    try{
      const res = await axios.delete(`http://localhost:4000/api/conge/cancelLeaveRequest/${id}`, {
        withCredentials: true
      });
      console.log(res);
      toast.success(t('cancel_success'), {
        position: "top-center",           // Positionne le toast en haut et centré horizontalement
        autoClose: 3000,                  // Ferme automatiquement le toast après 3000 ms (3 secondes)
        hideProgressBar: true,           // Affiche la barre de progression (temps restant)
        closeOnClick: true,               // Ferme le toast si l’utilisateur clique dessus
        pauseOnHover: true,               // Met en pause la fermeture automatique si la souris survole le toast
        draggable: true,                  // Permet de déplacer le toast avec la souris
        progress: undefined,              // Laisse la progression automatique par défaut
        icon: <CheckCircle color="#2f51eb" />,
      });
      fetchHistoric();
    } catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchHistoric();
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

  if(isLoading){
    return(
      <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-lg italic mt-10 gap-2">
        <div 
          className="
            w-5 h-5                
            border-4                
            border-gray-400         
            border-t-transparent    
            rounded-full           
            animate-spin            
          "
        ></div>
        {t('loading')}
      </div>
    )
  }

  return (
    <div className='flex flex-col justify-center items-center px-4'>
      {/* Title */}
      <div className='flex justify-center'>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-mediumBlue dark:text-politeBlue mb-10" data-aos="fade-right">
          {t("leave_history")}
        </h2>
      </div> 
      {/* 🔍 Search Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 w-full max-w-4xl justify-center">
        <select
          className="border-2 px-4 py-2 rounded-md w-full md:w-1/2 border-mediumBlue/90 dark:bg-blue-950/80 dark:border-lightBlue dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-200"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          data-aos="fade-right" data-aos-delay="200"
        >
          <option value="" disabled>{t("filter_by")}</option>
          <option value="all">{t("filter_type.all")}</option>
          <option value="type">{t('filter_type.type')}</option>
          <option value="status">{t('filter_type.status')}</option>
          <option value="date">{t('filter_type.date')}</option>
        </select>
        {
          filterBy === 'type' ?
          (
            <select
              className="border-2 px-4 py-2 rounded-md w-full md:w-1/2 border-mediumBlue/90 dark:bg-blue-950/80 dark:border-lightBlue dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-200"
              value={type}
              onChange={(e) => setType(e.target.value)}
              data-aos="fade-left"
            >
              <option value="annuel">{t('annuel')}</option>
              <option value="maternite">{t('maternite')}</option>
              <option value="paternite">{t('paternite')}</option>
              <option value="sans_solde">{t('sans_solde')}</option>
              <option value="maladie">{t('maladie')}</option>
              <option value="examen">{t('examen')}</option>
              <option value="Décès (conjoint, parent, enfant)">{t('Décès (conjoint, parent, enfant)')}</option>
              <option value="Décès (frère, sœur, beau-parent)">{t('Décès (frère, sœur, beau-parent)')}</option>
            </select>
          ) : 
          filterBy === 'status' ?
          (
            <select
              className="border-2 px-4 py-2 rounded-md w-full md:w-1/2 border-mediumBlue/90 dark:bg-blue-950/80 dark:border-lightBlue dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-200"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              data-aos="fade-left"
            >
              <option value="approved">{t('status.approved')}</option>
              <option value="rejected">{t('status.rejected')}</option>
            </select>
          ) : 
          filterBy === 'date' ? 
          (
            <input
              type="date"
              className="border-2 px-4 py-2 rounded-md w-full md:w-1/2 border-mediumBlue/90 dark:bg-blue-950/80 dark:border-lightBlue dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-200"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-aos="fade-left"
            />
          ) : null
        }        
      </div>
      {historic.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg italic mt-10">
          {t('no_leave_requests')}
        </p>
      ) : 
        (
          filterLeaves.length === 0 ? 
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg italic mt-10">
            {t('no_matching_leave')}
          </p> : 
          (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl" data-aos='zoom-in' data-aos-delay='500'>
              {filterLeaves.map(item => {
                const hr = hrs[item.approuvePar || item.refusePar];
                return (
                  <div
                    key={item._id}
                    className="flex flex-col gap-1 rounded-2xl p-5 bg-white dark:bg-blue-950/80 shadow-md text-base sm:text-[17px]"
                  >
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      📅 {t('start_date')}: {new Date(item.date_debut).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      📅 {t('end_date')}: {new Date(item.date_fin).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      📆 {t('number_of_days')}: {item.nombreDeJours}
                    </p>

                    <p className="text-gray-600 dark:text-gray-300">
                      📝 {t('leave_type')}: {t(item.motif?.type)}
                    </p>
                      {item.approuvePar ? (
                        <p className="text-gray-600 dark:text-gray-300 font-medium">
                          ✅ {t('approved_by')}: {hr.prenom} {hr.nom}
                        </p>
                      ) : 
                      item.refusePar ? (
                        <p className="text-gray-600 dark:text-gray-300 font-medium">
                          ❌ {t('rejected_by')}: {hr.prenom} {hr.nom}
                        </p>
                      ) : (
                        <div className="mt-3 flex flex-col gap-2">
                          <p className="text-gray-500 dark:text-gray-400 italic">
                            {t('not_processed_yet')}
                          </p>
                          <div className='flex justify-end'>
                            <button
                              onClick={() => cancelReq(item._id)}
                              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 rounded-lg transition w-fit cursor-pointer"
                            >
                              <X size={16} strokeWidth={3}/>
                              {t('cancel')}
                            </button>
                          </div>
                        </div>
                      )
                      }
                  </div>
                );
              })}  
            </div>  
          )
        )
      }
      <ToastContainer theme={theme} />
    </div>   
  )
}
