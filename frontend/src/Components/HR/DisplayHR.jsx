import axios from 'axios';
import { CheckCircle, Pencil, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DisplayHR() {

  const [hrs, setHrs] = useState([]);
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const fetchHRs = async () => {
    try{
      const res = await axios.get('http://localhost:4000/api/employee/getEmployeesByRole/RH', {
        withCredentials: true
      })
      setHrs(res.data.employees.reverse());
      setIsLoading(false);
    } catch(error) {
      console.log(`Error fetching HR : ${error}`);
    }
  }

  useEffect(() => {
    fetchHRs();
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

  const handleDelete = async (id) => {
    const confirm = window.confirm(t('confirm_delete_hr'));
    if(!confirm)
      return;
    try{
      const res = await axios.delete(`http://localhost:4000/api/employee/deleteEmployeeById/${id}`, {
        withCredentials: true
      });
      fetchHRs();
      toast.success(t('hr_delete_success'), {
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

  if(isLoading){
    return(
      <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-lg italic mt-10 gap-2">
        {/* Spinner element: a div shaped as a circle with a spinning border */}
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

        {/* Loading text translated */}
        {t('loading')}
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-mediumBlue dark:text-politeBlue mb-10 mt-5" data-aos="fade-right">
        {t("hr_list_title")}
      </h2>

      {hrs.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg italic mt-10">
          {t('no_hr_message')}
        </p>
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" data-aos="zoom-in" data-aos-delay='300'>
          {hrs.map((hr) => {
            return(
              <div
                key={hr._id}
                className="relative bg-white dark:bg-blue-950/50 rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow space-y-3"
              >
                {/* Nom complet */}
                <h3 className="text-lg font-semibold text-blue-800 dark:text-gray-200">
                  {hr.prenom} {hr.nom}
                </h3>

                {/* Email avec label */}
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Email :</span> {hr.email}
                </p>

                {/* Boutons d'action */}
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    className="text-mediumBlue dark:text-lightBlue hover:text-darkBlue dark:hover:text-mediumBlue cursor-pointer "
                    title={t("edit")}
                    onClick={() => window.location.href = `HRs/Edit/${hr._id}`}
                  >
                    <Pencil />
                  </button>
                  <button
                    onClick={() => handleDelete(hr._id)}
                    className="text-red-600 hover:text-red-800 dark:hover:text-red-700 cursor-pointer"
                    title={t("delete")}
                  >
                    <Trash />
                  </button>
                </div>
              </div>
            )
          })}

        </div>
      )}
      <ToastContainer theme={theme} />
    </div>
  )
}
