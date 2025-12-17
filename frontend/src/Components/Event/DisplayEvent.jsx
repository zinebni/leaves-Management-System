import { CheckCircle, Pencil, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api';

export default function DisplayEvent() {

  const {t, i18n} = useTranslation();
  const [events, setEvents] = useState([]);
  const currentLanguage = i18n.language;
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try{
      const res = await api.get('/api/evenement/getevenements');
      const events = res.data.evenements.reverse();
      setEvents(events);
    } catch(error){
      console.log(error);
    }
    setIsLoading(false);
  }

  const filterEvents = events.filter(event => {
    const matchesTitle = title
      ? event.titre.toLowerCase().includes(title.toLowerCase())
      : true;

    const matchesDate = date
      ? new Date(event.date_debut).toLocaleDateString(currentLanguage) === new Date(date).toLocaleDateString(currentLanguage) ||
        new Date(event.date_fin).toLocaleDateString(currentLanguage) === new Date(date).toLocaleDateString(currentLanguage)
      : true;

    return matchesTitle && matchesDate;
  });


  useEffect(() => {
    fetchEvents();
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
    const confirm = window.confirm(t('confirm_delete_event'));
    
    if(!confirm){
      return;
    }

    try{
      const res = await api.delete(`/api/evenement/deleteevenement/${id}`);
      console.log(res);
      fetchEvents();
      toast.success(t('event_deleted_successfully'), {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-lg italic mt-10 gap-2">
        <div className="w-5 h-5 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
        {t('loading')}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mx-5 mb-10">
      <div className="w-full mb-8 flex justify-center items-center">
        <h2 className="text-xl text-center sm:text-2xl font-bold text-mediumBlue dark:text-politeBlue mb-2" data-aos="fade-right">
          {t("event_list")}
        </h2>
      </div>
      {/* 🔍 Search Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 w-full max-w-4xl justify-center">
        <input
          type="text"
          placeholder={t("search_by_title")}
          className="border-2 px-4 py-2 rounded-md w-full md:w-1/2 border-mediumBlue/90 dark:bg-blue-950/50 dark:border-lightBlue dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-200"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          data-aos="fade-right" data-aos-delay="200"
        />
        <input
          type="date"
          className="border-2 px-4 py-2 rounded-md w-full md:w-1/2 border-mediumBlue/90 dark:bg-blue-950/50 dark:border-lightBlue dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-200"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          data-aos="fade-right" data-aos-delay="400"
        />
      </div>
      {
        events.length === 0 ?
        (
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg italic mt-10">
            {t('no_events_message')}
          </p>
        ) : (filterEvents.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300 text-lg italic mt-10">
                {t('no_matching_events')}
              </p>
            ) : 
            (
              <div data-aos='zoom-in' data-aos-delay='800'
              className='grid grid-cols-1 lg:grid-cols-3 gap-6 sm:px-10'>
                {
                  filterEvents.map((event,i) => {
                    const start_date = new Date(event.date_debut).toLocaleDateString(currentLanguage);
                    const end_date = new Date(event.date_fin).toLocaleDateString(currentLanguage);
                    return (
                      <div
                        key={event._id}
                        className="relative bg-white dark:bg-blue-950/50 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow space-y-3"
                      >
                        <h3 className="text-[17px] sm:text-lg font-semibold text-blue-800 dark:text-gray-200">
                          {event.titre}
                        </h3>

                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{t('start_date')} :</span> {start_date}
                        </p>

                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{t('end_date')} :</span> {end_date}
                        </p>

                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{t('location')} :</span>{" "}
                          {event.lieu ? event.lieu : t("not_available")}
                        </p>

                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{t('description')} :</span>{" "}
                          {event.description ? event.description : t("not_available")}
                        </p>
                        <div className="flex justify-end gap-4 mt-4">
                          <button
                            className="text-mediumBlue dark:text-lightBlue hover:text-darkBlue dark:hover:text-mediumBlue cursor-pointer"
                            title={t("edit")}
                            onClick={() => navigate(`Edit/${event._id}`)}
                          >
                            <Pencil />
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
                            className="text-red-600 hover:text-red-800 dark:hover:text-red-700 cursor-pointer"
                            title={t("delete")}
                          >
                            <Trash />
                          </button>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            )
        )
      }
      <ToastContainer theme={theme} />
    </div>
  )
}
