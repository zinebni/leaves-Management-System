import { CalendarCheck, CalendarClock, CheckCircle, FileText, MapPin, Text } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api';

export default function AddEvent() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [place, setPlace] = useState('');
  const [error, setError] = useState({});
  const {t} = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // This is the stable theme-handling logic.
    // It will not crash the component on navigation.
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
  
  const add = async () => {
    let isValid = true;
    const newError = {};

    if(!title.trim()){
      newError.title = t('event.errors.title_required');
      isValid = false;
    }
    if(!startDate){
      newError.startDate = t('event.errors.start_date_required');
      isValid = false;
    } else if(new Date(startDate) <= new Date()){
      newError.startDate = t('event.errors.start_date_after_today');
      isValid = false;
    }
    if(!endDate){
      newError.endDate = t('event.errors.end_date_required');
      isValid = false;
    } else if(new Date(endDate) < new Date(startDate)){
      newError.endDate = t('event.errors.end_date_after_start');
      isValid = false;
    }
    if(!isValid) {
      setError(newError);
      return;
    }

    setError({});
    const event = {
      titre: title,
      date_debut: startDate,
      date_fin: endDate,
      ...(description && { description }),
      ...(place && {lieu : place})
    };

    try{
      const res = await api.post('/api/evenement/createevenement', event);

      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setPlace('');
      toast.success(t('event_added_successfully'), {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: <CheckCircle color="#2f51eb" />,
      });
    } catch(error){
      console.log(error);
    }

  }


  return(
    <div className={`flex justify-center items-center w-full`}>
        <div className='bg-mediumBlue/60 dark:bg-blue-950/50 shadow-xl ring-1 ring-white/10  border-2 border-mediumBlue/50 w-fit flex flex-col items-center justify-center px-8 sm:px-10 py-5 sm:py-6 rounded-xl dark:border-none'>
        <h2 className='mb-8 font-bold text-lg sm:text-xl text-gray-900/95 dark:text-gray-200'>
          {t('add_event_title')}
        </h2>
        <div className='grid grid-cols-1 gap-2'>
          <div className="text-sm sm:text-[17px] w-full sm:w-xs">
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Text size={20} />
              </span>
              <input 
                  placeholder={t('event_title_placeholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
              />
            </div>
            <p className='pl-5 text-red-700 dark:text-red-500'>
              {error.title}
            </p>
          </div>
          <div className='text-sm sm:text-[17px] w-full sm:w-xs'>
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
                />
              </>
            </div>
            <p className='pl-5 text-red-700 dark:text-red-500'>
              {error.description}
            </p>
          </div>
          <div className='text-sm sm:text-[17px] w-full sm:w-xs'>
              <label className="block mb-1 pl-2 text-gray-700 dark:text-gray-200 font-medium">
                {t('start_date')}
              </label>
            <div className="relative  mb-2">
              <span className="absolute left-3 pt-4 text-gray-600">
                <CalendarClock size={20} />
              </span>
              <input 
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
              />
            </div>
            <p className='pl-5 text-red-700 dark:text-red-500'>
              {error.startDate}
            </p>
          </div>
          <div className='text-sm sm:text-[17px] w-full sm:w-xs'>
              <label className="block pl-2 mb-1 text-gray-700 dark:text-gray-200 font-medium">
                {t('end_date')}
              </label>
            <div className="relative mb-2">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                  <CalendarCheck size={20} />
                </span>
                <input 
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
                />
            </div>
            <p className='pl-5 text-red-700 dark:text-red-500'>
              {error.endDate}
            </p>
          </div>
          <div className='text-sm sm:text-[17px] w-full sm:w-xs'>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <MapPin size={20} />
              </span>
              <input 
                placeholder={t('place_placeholder')}
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
              />
            </div>
            <p className='pl-5 text-red-700'>
              {error.place}
            </p>
          </div>
          <button className='text-base sm:text-[17px] font-semibold bg-blue-700 dark:bg-blue-900/90 dark:hover:bg-blue-800/80 w-full sm:w-xs py-2 sm:py-3 text-white rounded-lg sm:rounded-xl mb-2 cursor-pointer hover:bg-blue-600'
            onClick={add}
          >
            {t('add_event_button')}
          </button>
        </div>
      </div>
      <ToastContainer theme={theme} />
    </div>
  )
}
