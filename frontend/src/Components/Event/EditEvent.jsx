import { CalendarCheck, CalendarClock, CheckCircle, FileText, MapPin, Text } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api';

export default function EditEvent() {

  const [event, setEvent] = useState({
    titre: '',
    description: '',
    date_debut: '',
    date_fin: '',
    lieu: '',
  });
  const [error, setError] = useState({});
  const {t} = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const {id} = useParams();
  const navigate = useNavigate();

  const fetchEvent = async () => {
    try{
      const res = await api.get(`/api/evenement/getevenementById/${id}`);
      const evt = res.data.evenement;
      setEvent({
        titre: evt.titre,
        description: evt.description || '',
        date_debut: evt.date_debut,
        date_fin: evt.date_fin,
        lieu: evt.lieu || ''
      });
    } catch(error){
      console.log(error);
    }
  }

  const edit = async () => {
    let isValid = true;
    const newError = {};

    if(!event.titre.trim()){
      newError.titre = t('event.errors.title_required');
      isValid = false;
    }
    if(!event.date_debut){
      newError.date_debut = t('event.errors.start_date_required');
      isValid = false;
    } else if(new Date(event.date_debut) <= new Date()){
      newError.date_debut = t('event.errors.start_date_after_today');
      isValid = false;
    }
    if(!event.date_fin){
      newError.date_fin = t('event.errors.end_date_required');
      isValid = false;
    } else if(new Date(event.date_fin) < new Date(event.date_debut)){
      newError.date_fin = t('event.errors.end_date_after_start');
      isValid = false;
    }
    if(!isValid) {
      setError(newError);
      return;
    }

    setError({});

    try{
      const res = await api.put(`/api/evenement/updateevenement/${id}`, event);
      toast.success(t('event_updated_successfully'), {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: <CheckCircle color="#2f51eb" />,
      });
      setTimeout(() => {
        navigate(-1);
      }, 3500);
    } catch(error){
      console.log(error);
    }

  }

  useEffect(() => {
    // This is the stable theme-handling logic.
    // It will not crash the component on navigation.
    fetchEvent();

    const handleThemeChange = () => {
      const storedTheme = localStorage.getItem('theme') || 'light';
      setTheme(storedTheme);
    };

    // Listen for the custom event that our DarkMode toggle now dispatches.
    window.addEventListener('themeChanged', handleThemeChange);

    // Cleanup: remove the event listener when the component unmounts.
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []); // Empty dependency array ensures this runs only once on mount.
  

  return(
    <div className={`flex justify-center items-center`}>
        <div className='bg-mediumBlue/60 dark:bg-blue-950/50 shadow-xl ring-1 ring-white/10  border-2 border-mediumBlue/50 w-fit flex flex-col items-center justify-center px-8 sm:px-10 py-5 sm:py-6 rounded-xl dark:border-none'>
        <h2 className='mb-8 font-bold text-lg sm:text-xl text-gray-900/95 dark:text-gray-200'>
          {t('edit_event_title')}
        </h2>
        <div className='grid grid-cols-1 gap-2'>
          <div className="text-sm sm:text-[17px] w-2xs sm:w-xs">
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Text size={20} />
              </span>
              <input 
                  placeholder={t('event_title_placeholder')}
                  value={event.titre}
                  onChange={(e) => setEvent(prev => ({...prev, titre: e.target.value}))}
                  className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
              />
            </div>
            <p className='pl-5 text-red-700 dark:text-red-500'>
              {error.titre}
            </p>
          </div>
          <div className='text-sm sm:text-[17px] w-2xs sm:w-xs'>
            {/* relative: This makes the container a reference point for absolutely positioning elements inside it. */}
            <div className="relative mb-2">
              {/* 
                  *top-1/2 sets the top edge of the icon to 50% of the height of its container.
                  *But that puts the top edge in the middle — so the icon appears slightly lower than centered.
                  *-translate-y-1/2 shifts the icon up by 50% of its own height, which repositions it to be truly centered.
                  * the first - in translate mean negative
              */}
              <>
                <span className="absolute left-3 pt-4 text-gray-600">
                  <FileText size={20} />
                </span>
                <textarea 
                  placeholder={t('description_placeholder')}
                  value={event.description}
                  onChange={(e) => setEvent(prev => ({...prev, description: e.target.value}))}
                  className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
                />
              </>
            </div>
            <p className='pl-5 text-red-700 dark:text-red-500'>
              {error.description}
            </p>
          </div>
          <div className='text-sm sm:text-[17px] w-2xs sm:w-xs'>
              <label className="block mb-1 pl-2 text-gray-700 dark:text-gray-200 font-medium">
                {t('start_date')}
              </label>
            <div className="relative  mb-2">
              <span className="absolute left-3 pt-4 text-gray-600">
                <CalendarClock size={20} />
              </span>
              <input 
                type="date"
                value={event.date_debut ? new Date(event.date_debut).toISOString().slice(0,10) : ""}
                onChange={(e) => setEvent(prev => ({ ...prev, date_debut: e.target.value }))}
                className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
              />
            </div>
            <p className='pl-5 text-red-700 dark:text-red-500'>
              {error.date_debut}
            </p>
          </div>
          <div className='text-sm sm:text-[17px] w-2xs sm:w-xs'>
              <label className="block pl-2 mb-1 text-gray-700 dark:text-gray-200 font-medium">
                {t('end_date')}
              </label>
            <div className="relative mb-2">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                  <CalendarCheck size={20} />
                </span>
                <input 
                  type='date'
                  value={event.date_fin ? new Date(event.date_fin).toISOString().slice(0,10) : ""}
                  onChange={(e) => setEvent(prev => ({...prev, date_fin: e.target.value}))}
                  className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
                />
            </div>
            <p className='pl-5 text-red-700 dark:text-red-500'>
              {error.date_fin}
            </p>
          </div>
          <div className='text-sm sm:text-[17px] w-2xs sm:w-xs'>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <MapPin size={20} />
              </span>
              <input 
                placeholder={t('place_placeholder')}
                value={event.lieu}
                onChange={(e) => setEvent(prev => ({...prev, lieu: e.target.value}))}
                className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
              />
            </div>
            <p className='pl-5 text-red-700'>
              {error.lieu}
            </p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mt-8'>
            <button className='text-base sm:text-[17px] font-semibold bg-gray-700 hover:bg-gray-800 dark:bg-gray-400 dark:text-gray-900 dark:hover:bg-gray-300 py-2 text-white rounded-lg sm:rounded-lg mb-2 cursor-pointer'
              onClick={() => navigate(-1)}
            >
              {t('cancel_event_button')}
            </button>
            <button className='text-base sm:text-[17px] font-semibold bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700  py-2 text-white rounded-lg sm:rounded-lg mb-2 cursor-pointer hover:bg-blue-600'
              onClick={edit}
            >
              {t('edit_event_button')}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer theme={theme} />
    </div>
  )
}
