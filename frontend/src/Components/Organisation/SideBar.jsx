import axios from 'axios';
import { MoveLeft, X } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function SideBar({ open, setOpen, links, gap}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // --- REFACTORED CLASSES ---

  // 1. Define classes that are TRULY common to both states (no color/bg conflicts)
  const commonClasses = "flex items-center gap-2 rounded-lg transition sm:border-2 mb-5 py-2 px-3";

  // 2. Define classes ONLY for the INACTIVE state
  const inactiveClasses = "text-gray-800 sm:bg-gray-100 hover:text-mediumBlue dark:text-gray-300 dark:bg-transparent dark:hover:text-lightBlue";

  // 3. Define classes ONLY for the ACTIVE state
  const activeClasses = "text-mediumBlue font-semibold sm:font-normal sm:bg-mediumBlue sm:hover:text-white sm:text-white dark:border-none sm:dark:bg-blue-950/80";
  
  // --- END REFACTORED CLASSES ---


  const moveToHome = async () => {
    try{
      const res = await axios.post('http://localhost:4000/api/auth/logout', {}, {
        withCredentials: true
      });
    } catch(error){
      console.log('Failed to logout : ' + error.message);
    }
    setOpen(false);
    navigate('/');
  }

  return (
    <aside className={`fixed inset-y-0 sm:static top-0 left-0 z-50 sm:mt-8 w-full sm:w-72  text-gray-800 dark:text-gray-200 py-4  px-6 ${open ? 'block bg-gray-50 dark:bg-blue-950' : 'hidden'} sm:block sm:bg-transparent`}>
      <div className='flex justify-end sm:hidden dark:text-white mb-5'>
        <X onClick={() => setOpen(false)} />
      </div>

      <div className={clsx("flex flex-col", {
        "gap-64": gap === 64,
        "gap-72": gap === 72,
        "gap-96": gap === 96,
        "gap-52": gap === 52
      })}>
        <div>
          {links.map(({ to, icon, label, end = false }, i) => {
            const Icon = icon;
            return(
              <NavLink
                key={i}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                // 4. Use the ternary operator to choose which classes to apply
                className={({ isActive }) => 
                  `${commonClasses} ${isActive ? activeClasses : inactiveClasses}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} strokeWidth={isActive ? 3 : 2} />
                    {t(label)}
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
        <button
          onClick={moveToHome}
          // The logout button is always "inactive", so we can use these classes
          className={`${commonClasses} ${inactiveClasses}`}
        >
          <MoveLeft size={18} strokeWidth={2} />
          {t('disconnect')}
        </button>

      </div>
    </aside>
  );
}