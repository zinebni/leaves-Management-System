import React, { useEffect, useState } from 'react';
// Importation des outils nécessaires de react-big-calendar et date-fns
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// `format`: formate un objet Date en chaîne lisible selon un format donné
// Exemple : format(new Date(), 'dd/MM/yyyy') → "21/07/2025"

// `parse`: transforme une chaîne de caractères en objet Date selon un format donné
// Exemple : parse('21/07/2025', 'dd/MM/yyyy', new Date())

// `startOfWeek`: retourne le premier jour de la semaine pour une date donnée
// Exemple : startOfWeek(new Date(), { weekStartsOn: 1 }) → Lundi de la semaine courante

// `getDay`: retourne le jour de la semaine (0 = Dimanche, 1 = Lundi, ..., 6 = Samedi)
// Exemple : getDay(new Date('2025-07-21')) → 1 (Lundi)

// `Calendar`: composant React pour afficher un calendrier avec des événements
// `dateFnsLocalizer`: fonction utilitaire pour permettre au calendrier de fonctionner avec date-fns


// Importation des locales françaises et anglaises
import fr from 'date-fns/locale/fr';
import en from 'date-fns/locale/en-US';

// Style par défaut de react-big-calendar
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Importation de i18n pour la traduction
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function RequestLeave() {
  const { t, i18n } = useTranslation(); // Hook de traduction
  const [view, setView] = useState(Views.MONTH); // Vue par défaut : Mois
  const [date, setDate] = useState(new Date());  // État pour la date affichée
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const {employeeId} = useParams();
  const [droits, setDroits] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState('');
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const selectedDroit = droits.find(droit => droit.type === selectedLeave);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');


  const fetchDroitsGonges = async () => {
    const res = await axios.get(`http://localhost:4000/api/droits/getLeaveRightsByEmployee/${employeeId}`, {
      withCredentials: true
    });

    setDroits(res.data.droits);
  }

  useEffect(() => {
    fetchDroitsGonges();
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

  const addRequest = async (remainingDays) => {
    let isValid = true;
    if(!startDate){
      isValid = false;
      setError(t('select_date_range'));
    } else if(startDate <= new Date()){
      isValid = false;
      setError(t('leave_start_date_after_today'));
    }else {
      const nbrOfDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

      if (!Number.isNaN(remainingDays) && nbrOfDays > remainingDays) {
        isValid = false;
        setError(t('days_exceed_remaining'));
      }
    }
    
    if(isValid) {
      setError('');
      setStartDate(null);
      setEndDate(null);
      setSelectedLeave('');
      setComment('');
      setSelectedFile(null);

      const request = {
        date_debut: startDate,
        date_fin: endDate,
        motif: selectedDroit._id,
        ...(comment && {commentaire : comment}),
        ...(selectedFile && {justificatif: selectedFile})
      }
      console.log(request);

      try{
        const res = await axios.post('http://localhost:4000/api/conge/createLeaveRequest', request, {
          withCredentials:true
        });
        
        toast.success(t('send_request_success'), {
          position: "top-center",           // Positionne le toast en haut et centré horizontalement
          autoClose: 3000,                  // Ferme automatiquement le toast après 3000 ms (3 secondes)
          hideProgressBar: true,           // Affiche la barre de progression (temps restant)
          closeOnClick: true,               // Ferme le toast si l’utilisateur clique dessus
          pauseOnHover: true,               // Met en pause la fermeture automatique si la souris survole le toast
          draggable: true,                  // Permet de déplacer le toast avec la souris
          progress: undefined,              // Laisse la progression automatique par défaut
          icon: <CheckCircle color="#2f51eb" />,
        });
      } catch(error) {
        console.log(error);
      }
    }

    

  }

  // --- ÉTAPE 3: Créer le gestionnaire de sélection ---
  const handleSelectSlot = (slotInfo) => {
    const clickedDate = slotInfo.start;

    // Si aucune date sélectionnée (premier clic)
    if (!startDate && !endDate) {
      setStartDate(clickedDate);
      setEndDate(clickedDate);
      return;
    }

    // Si seule la date de début est définie (second clic)
    if (startDate && endDate && startDate.getTime() === endDate.getTime()) {
      if (clickedDate < startDate) {
        setStartDate(clickedDate);
      } else {
        setEndDate(clickedDate);
      }
      return;
    }

    // Sinon, on réinitialise la sélection (nouveau premier clic)
    setStartDate(clickedDate);
    setEndDate(clickedDate);
  };



  // Configuration des locales disponibles pour le calendrier
  const locales = {
    fr: fr,
    en: en,
  };

  // Création du localizer pour react-big-calendar avec date-fns
  const localizer = dateFnsLocalizer({
    format, // Fonction de date-fns pour formater une date en texte (ex: 21/07/2025)
    
    parse,  // Fonction de date-fns pour analyser un texte et le convertir en objet Date (ex: "21/07/2025" → Date)
    
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), 
    // Fonction qui détermine le jour où commence la semaine.
    // Ici, { weekStartsOn: 1 } signifie que la semaine commence le lundi (1 = lundi, 0 = dimanche).
    
    getDay, // Fonction qui retourne le jour de la semaine (ex: getDay(new Date()) → 1 pour lundi)

    locales, 
    // Objet contenant les langues/fr locales importées de date-fns
    // Ex : { fr: frLocale, en: enLocale }
    // Cela permet d'afficher les noms des jours/mois dans la langue active (i18n.language)
  });


  // Liste des jours fériés marocains (en format ISO 8601)
  const marocHolidays = [
    { key: 'new_year', start: new Date(2025, 0, 1), end: new Date(2025, 0, 1) },
    { key: 'labour_day', start: new Date(2025, 4, 1), end: new Date(2025, 4, 1) },
    { key: 'throne_day', start: new Date(2025, 6, 30), end: new Date(2025, 6, 30) },
    { key: 'oued_eddahab', start: new Date(2025, 7, 14), end: new Date(2025, 7, 14) },
    { key: 'revolution_day', start: new Date(2025, 7, 20), end: new Date(2025, 7, 20) },
    { key: 'youth_day', start: new Date(2025, 7, 21), end: new Date(2025, 7, 21) },
    { key: 'green_march', start: new Date(2025, 10, 6), end: new Date(2025, 10, 6) },
    { key: 'independence_day', start: new Date(2025, 10, 18), end: new Date(2025, 10, 18) },
];



  // Transformation des jours fériés en événements pour le calendrier
  const holidayEvents = marocHolidays.map(holiday => ({
    title: t(`holidays.${holiday.key}`), // Traduction dynamique du titre
    start: holiday.start,       // Date de début
    end: holiday.end,         // Date de fin
    allDay: true,                        // Événement sur toute la journée
    resource: 'holiday',                 // Tag optionnel pour indiquer que c’est un jour férié
  }));

   // --- ÉTAPE 5: Créer un événement dynamique pour la sélection ---
  const selectionEvents = [];
  if (startDate) {
    // Si seule la date de début est sélectionnée, l'événement dure un jour
    // Si la date de fin est aussi sélectionnée, l'événement couvre la plage
    selectionEvents.push({
      start: startDate,
      end: endDate ? addDays(endDate, 1) : startDate, // Si endDate est null, utilise startDate
      title: t('selection'), // Ajoutez "selection": "Votre Sélection" dans votre fichier de traduction
      allDay: true,
      resource: 'selection', // Un identifiant pour le style
    });
  }

  // Combiner les jours fériés et l'événement de sélection
  const allEvents = [...holidayEvents, ...selectionEvents];

  // --- ÉTAPE 6: Styliser l'événement de sélection ---
  const eventStyleGetter = (event) => {
    // On ajoute le préfixe '!' aux classes qui sont en conflit.
    let newClassName = 'p-1 text-base rounded-md  !border-none '; // Classes communes

    if (event.resource === 'selection') {
      // Le '!' est la clé ici !
      newClassName += '!bg-zinc-500/50 font-semibold !text-black hover:!bg-zinc-500/70 dark:!text-gray-200 dark:!bg-gray-500 dark:hover:!bg-gray-400';
    } else if (event.resource === 'holiday') {
      newClassName += '!text-white !bg-mediumBlue hover:!bg-blue-800 dark:!bg-blue-900';
    } else {
      newClassName += '!bg-gray-500';
    }

    return {
      className: newClassName
    };
  };
   return (
    <div className="p-6">
      {/* Affichage des dates sélectionnées pour feedback utilisateur */}
      <div className="mb-4 px-5 py-4 bg-gray-200 dark:bg-blue-950/60 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-mediumBlue dark:text-gray-300 mb-2">{t('selected_period')}</h2>
        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <p>
            <span className="font-medium text-base text-slate-700 dark:text-slate-300">{t('start_date')}:</span>{' '}
            <span className='dark:text-gray-200'>
              {startDate ? format(startDate, 'PPPP', { locale: i18n.language === 'fr' ? fr : en }) : t('none')}
            </span>
          </p>
          <p>
            <span className="font-medium text-base text-slate-700 dark:text-slate-300">{t('end_date')}:</span>{' '}
            <span className='dark:text-gray-200'>
              {endDate ? format(endDate, 'PPPP', { locale: i18n.language === 'fr' ? fr : en }) : t('none')}
            </span>
          </p>
        </div>
      </div>

      <div>
        <Calendar
          localizer={localizer}
          events={allEvents} // Utilise la liste combinée
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          views={['month', 'agenda']}
          className='dark:text-white'
          messages={{
            today: t('today'),
            next: '›',
            previous: '‹',
            month: t('month'),
            agenda: t('agenda'),
            noEventsInRange: t('no_events'),
          }}
          culture={i18n.language}
          
          // --- ÉTAPE 2 & 3: Activer la sélection et lier le gestionnaire ---
          selectable={true}
          onSelectSlot={handleSelectSlot}

          // --- ÉTAPE 6: Appliquer le style conditionnel ---
          eventPropGetter={eventStyleGetter}
        />
        <p className='mt-3 text-red-500'>
          {error}
        </p>
      </div>
      <div className='mt-10 mb-56'>
        <div className='mb-5 pl-5'>
          {
            selectedDroit ? 
            (
              selectedDroit.hasOwnProperty('joursAutorisee') ? 
              (
                selectedDroit.joursAutorisee - selectedDroit.joursPris > 0 ?
                (
                  <p className='dark:text-white text-lg'>
                    <span className='font-semibold  text-mediumBlue dark:text-politeBlue'>{t('remaining_days')} : </span>
                    {selectedDroit.joursAutorisee - selectedDroit.joursPris}
                  </p>
                ) : (
                  <p className='font-semibold text-red-600'>
                    {t('no_remaining_days')}
                  </p>
                )
              ) : (
                <p className='dark:text-white text-lg'>
                  <span className='font-semibold text-mediumBlue dark:text-politeBlue'>{t('taken_days')} : </span>
                  {selectedDroit.joursPris}
                </p>
              )
            ) : null
          }
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          <div className='flex justify-start items-start'>
            <select 
              id="leave-type-select"
              value={selectedLeave}
              onChange={(e) => setSelectedLeave(e.target.value)}
              className='w-full px-4 py-2 border border-mediumBlue rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-mediumBlue focus:border-transparent text-gray-800 dark:text-white bg-white dark:bg-blue-950/80 placeholder-gray-400 transition duration-200 dark:border-slate-600'
            >
              {/* Option par défaut */}
              <option value="" disabled>
                {t('select_leave_type')}
              </option>
              
              {/* Boucle sur les types de congé pour créer les options */}
              {droits.map((droit) => (
                <option key={droit._id} value={droit.type}>
                  {t(`${droit.type}`)}
                </option>
              ))}
            </select>
          </div>
          {
            (selectedLeave && ((selectedDroit.hasOwnProperty('joursAutorisee') && (selectedDroit.joursAutorisee - selectedDroit.joursPris) > 0) || !selectedDroit.hasOwnProperty('joursAutorisee'))) ? (
              <>
                <input
                  type='text'
                  className='w-full px-4 py-2 border border-mediumBlue rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-mediumBlue focus:border-transparent text-gray-800 dark:text-white bg-white dark:bg-blue-950/80 placeholder-gray-400 transition duration-200 dark:border-slate-600'
                  placeholder={t('comment_placeholder')}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <input
                  type='file'
                  className='w-full px-4 py-2 border border-mediumBlue rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-mediumBlue focus:border-transparent text-gray-800 dark:text-white bg-white dark:bg-blue-950/80 placeholder-gray-400 transition duration-200 dark:border-slate-600'
                  // value={selectedFile} no for security
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <button className='text-base sm:text-lg font-semibold bg-mediumBlue dark:bg-darkBlue dark:hover:bg-blue-900 py-2 text-white rounded-lg sm:rounded-lg mb-2 cursor-pointer hover:bg-darkBlue h-full'
                  onClick={() => addRequest(selectedDroit.joursAutorisee - selectedDroit.joursPris)}
                >
                  {t('send_request')}
                </button>
              </>
            ) : null
          }
        </div>        
      </div>
      <ToastContainer theme={theme} />
    </div>
  );
}
