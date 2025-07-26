import axios from 'axios';
import { Boxes, CheckCircle, FileText } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddDept() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState({});
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState(false);

  // --- START OF THE FIX ---

  // 1. Get the initial theme directly from localStorage.
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

  // --- END OF THE FIX ---

  const add = async () => {
    // ... your existing add logic is fine ...
    let isValid = true;
    if(!name.trim()){
      isValid = false;
      setError({name: t('deptNameRequired')});
    }
    const dept = { nom: name, description };
    if(isValid){
      try{
        const res = await axios.post('http://localhost:4000/api/department/createDepartment', dept, { withCredentials: true });
        setName('');
        setDescription('');
        toast.success(t('deptAddSuccess'), {
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
        if(error.status){
          setMessage(t('department_already_exists'));
          setStatusMessage(false);
        }
      }
    }
  };

  return (
     <div className={`flex justify-center items-center mt-15 sm:mt-10 mb-5`}>
        <div className='bg-mediumBlue/60 dark:bg-blue-950/50 shadow-xl ring-1 ring-white/10  border-2 border-mediumBlue/50 w-fit flex flex-col items-center justify-center px-8 sm:px-10 py-5 sm:py-8 rounded-xl dark:border-none'>
        <h2 className='mb-8 font-bold text-lg sm:text-xl text-gray-900/95 dark:text-gray-200'>
          {t('add_department_title')}
        </h2>
        {/* ... Rest of your JSX ... */}
        <div className='text-sm sm:text-[17px] w-3xs sm:w-xs mb-4'>
          <div className="relative mb-2">
            <>
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Boxes size={20} />
              </span>
              <input 
                placeholder={t('department_name_placeholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
              />
            </>
          </div>
          <p className='pl-5 text-red-700'>{error.name}</p>
        </div>
        <div className='text-sm sm:text-[17px] w-3xs sm:w-xs mb-10'>
          <div className="relative  mb-2">
            <span className="absolute left-3 pt-4 text-gray-600">
              <FileText size={20} />
            </span>
            <textarea 
              placeholder={t('department_desc_placeholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl sm:rounded-xl border-2 focus:border-mediumBlue outline-none bg-zinc-200 border-gray-600 w-full"
            />
          </div>
        </div>
        <p className={`mb-5 text-base font-semibold ${statusMessage ? 'text-darkBlue' : 'text-red-600 dark:text-red-500'}`}>
          {message}
        </p>
        <button className='text-base sm:text-[17px] font-semibold bg-blue-700 dark:bg-blue-900/90 dark:hover:bg-blue-800/80 w-3xs sm:w-xs py-2 text-white rounded-md sm:rounded-lg mb-2 cursor-pointer hover:bg-blue-600'
          onClick={add}
        >
          {t('add_department')}
        </button>
      </div>
      <ToastContainer theme={theme} />
    </div>
  )
}