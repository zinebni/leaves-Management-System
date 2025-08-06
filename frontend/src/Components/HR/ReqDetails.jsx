import axios from 'axios';
import { AlertCircleIcon, Check, CheckCircle, History, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ReqDetails() {
  const {id,orgID} = useParams();
  const [congeDetails, setCongeDetails] = useState({});
  const {t} = useTranslation();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();
  
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

  const fetchDetails = async () => {
    try{
      const res = await axios.get(`http://localhost:4000/api/conge/getLeaveRequestById/${id}`, {
        withCredentials:true
      });

      console.log(res.data.data);
      setCongeDetails(res.data.data);
    } catch(error) {
      console.log(error);
    }
  }

  const approve = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/conge/approveLeaveRequest/${congeDetails.conge._id}`,
        {}, // no body needed
        { withCredentials: true } // put this in config
      );
      toast.success(t('leave_approved_successfully'), {
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
    } catch (error) {
      console.error(error);
    }
  }

  const reject = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/conge/rejectLeaveRequest/${congeDetails.conge._id}`,
        {}, // no body needed
        { withCredentials: true } // put this in config
      );
      toast.success(t('leave_rejected_successfully'), {
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
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className='flex flex-col justify-center items-center mb-5'>
      <h2 className="text-xl sm:text-2xl font-bold text-mediumBlue dark:text-politeBlue mb-10 mt-8" data-aos="fade-right">
        {t("leave_request_details")}
      </h2>
      <div data-aos='zoom-in' data-aos-delay='400'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full px-6" >
          {/* Employee Profile */}
          <div className="bg-white dark:bg-blue-950/50 rounded-2xl p-6 shadow-md border-2 dark:border-gray-400">
            <h3 className="text-lg sm:text-xl font-bold text-mediumBlue dark:text-politeBlue mb-4 flex items-center gap-2">
              <span className="text-lg sm:text-xl filter brightness-125 dark:brightness-150">👤</span>
              {t('Employee Profile')}
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>{t('fullname_label')}:</strong> {congeDetails.conge?.employee.prenom} {congeDetails.conge?.employee.nom}</li>
              <li><strong>{t('dept')}:</strong> {congeDetails.conge?.employee.department.nom}</li>
              <li><strong>{t('family_situation')}:</strong> {t(congeDetails.conge?.employee.situationFamiliale)}</li>
              <li><strong>{congeDetails.conge?.employee.nombreEnfants && `${t('child_number_placeholder')}:`}</strong> {congeDetails.conge?.employee.nombreEnfants}</li>
            </ul>
          </div>

          {/* Leave Details */}
          <div className="bg-white dark:bg-blue-950/50 rounded-2xl p-6 shadow-md border-2 dark:border-gray-400">
            <h3 className="text-lg sm:text-xl font-bold text-mediumBlue dark:text-politeBlue mb-4 flex items-center gap-2">
              📝 {t('request_details')}
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>{t('leave_type_label')}:</strong> {t(congeDetails.conge?.motif.type)}</li>
              {
                congeDetails.conge?.motif.hasOwnProperty('joursAutorisee') ? (
                  <li><strong>{t('remaining_days')}:</strong> {congeDetails.conge?.motif.joursAutorisee - congeDetails.conge?.motif.joursPris}</li>
                ) : (
                  <li><strong>{t('taken_days')}:</strong> {congeDetails.conge?.motif.joursPris}</li>
                )
              }
              <li><strong>{t('leave_payment_label')}:</strong> {congeDetails.conge?.motif.estPaye ? t('leave_paid') : t('leave_unpaid')}</li>
              <li><strong>{t('number_of_days')}:</strong> {congeDetails.conge?.nombreDeJours}</li>
              <li><strong>{t('start_date')}:</strong> {new Date(congeDetails.conge?.date_debut).toLocaleDateString()}</li>
              <li><strong>{t('end_date')}:</strong> {new Date(congeDetails.conge?.date_fin).toLocaleDateString()}</li>
              {
                congeDetails.conge?.commentaire && (
                  <li><strong>{t('comment')}:</strong> {congeDetails.conge?.commentaire}</li>
                )
              }
              {
                congeDetails.conge?.justificatif.length > 0 && (
                  <button onClick={() => setPreviewVisible(true)}
                    className="text-mediumBlue dark:text-lightBlue hover:text-darkBlue dark:hover:text-mediumBlue cursor-pointer text-base sm:text-[17px] font-semibold"
                  >
                    {t('view_justificatif')}
                  </button>
                )
              }
            </ul>
          </div>
          {previewVisible && createPortal(
            <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-md flex justify-center items-center">
              <div className="bg-lightBlue border-mediumBlue dark:bg-blue-900 border-2 dark:border-blue-950 p-4 rounded-xl shadow-2xl max-w-4xl w-full relative">
                <iframe
                  src={`http://localhost:4000/uploads/${congeDetails.conge?.justificatif[0]}`}
                  className="w-full h-[500px] rounded-xl"
                  title="Justificatif"
                />
                <button
                  onClick={() => setPreviewVisible(false)}
                  className="absolute top-3 right-4 bg-white text-blue-700 dark:text-blue-800 p-1 rounded-full  dark:hover:bg-gray-50 transition cursor-pointer"
                  aria-label="Close"
                >
                  <X size={20} strokeWidth={3}/>
                </button>
              </div>
            </div>,
            document.body
          )}

        </div>
        <div className="max-w-5xl w-full px-6 mt-6 flex flex-col sm:flex-row gap-4">
          <div className='w-full sm:w-1/2'>
            {
              congeDetails.congesHistorique?.length === 0 ? (
                <div className="flex justify-start items-center gap-2 text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-xl border border-red-300 dark:border-red-700">
                  <AlertCircleIcon size={18} />
                  <p className="text-sm sm:text-base font-medium">
                    {t('no_leave_history_for_employee')}
                  </p>
                </div>
              ) : (
                <Link
                  to={`Emp/Historic`}
                  className="flex items-center justify-start gap-2 text-mediumBlue dark:text-blue-300 hover:text-darkBlue  dark:hover:text-blue-200 p-3 rounded-xl border border-mediumBlue/20 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 font-medium text-sm sm:text-base"
                >
                  <History size={18} />
                  {t('leave_history_for_employee')}
                </Link>
              )
            }
          </div>
          <div  className='w-full sm:w-1/2'>
          {
            congeDetails.nbrchevauchemt !== undefined && (
              <div className={`flex items-center gap-2 p-3 rounded-xl 
                ${
                  congeDetails.nbrchevauchemt === 0
                  ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-600"
                  : "text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600"
                }
              `}>
                <AlertCircleIcon size={18} />
                <p className="text-sm sm:text-base font-medium">
                {congeDetails.nbrchevauchemt === 0 ? (
                  t('no_leave_same_department')
                ) : (
                  <Trans
                    i18nKey="leave_same_department"
                    count={congeDetails.nbrchevauchemt}
                    components={[
                      <Link
                        key="0"
                        to={'dept'}
                        className="underline font-semibold hover:text-yellow-800 dark:hover:text-amber-200"
                      />
                    ]}
                  />
                )}
              </p>
              </div>
            )
          } 
          </div>
        
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end px-6 w-full max-w-5xl gap-4 mt-6 text-sm sm:text-base">
          {/* Bouton Approuver */}
          <button
            onClick={approve}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-mediumBlue hover:bg-blue-800 dark:bg-blue-900/90 dark:hover:bg-blue-800/80 transition-all shadow-sm font-semibold cursor-pointer"
          >
            <Check size={18} strokeWidth={3} />
            {t('approve')}
          </button>

          {/* Bouton Rejeter */}
          <button
            onClick={reject}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-500 transition-all shadow-sm font-semibold cursor-pointer"
          >
            <X size={18} strokeWidth={3} />
            {t('reject')}
          </button>
        </div>
      </div>
    <ToastContainer theme={theme} />
  </div>
  )
}
