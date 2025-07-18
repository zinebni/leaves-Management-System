import { Eye, Plus, Users, X } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
// 1. Import NavLink instead of Link
import { NavLink } from 'react-router-dom';

// 2. Remove currentPage from the props
export default function SideBarOrg({ name, open, setOpen }) {

  const { t } = useTranslation();

  // 3. Define a function or string for our base and active classes to keep it DRY
  const baseLinkClass = "flex items-center gap-2 hover:bg-lightBlue dark:hover:bg-blue-800 p-2 rounded transition font-semibold";
  const activeLinkClass = "text-mediumBlue dark:text-blue-300";

  return (
    <aside className={`inset-y-0 fixed sm:static top-0 left-0 z-50 w-full sm:w-64 bg-lightBlue/50 text-gray-800  dark:text-gray-200 sm:dark:bg-blue-950/90  p-6 shadow-lg ${open ? 'block bg-politeBlue dark:bg-blue-950' : 'hidden'} sm:block`}>

      <h2 className="hidden sm:block text-2xl font-bold mb-10">Admin</h2>
      <div className='flex justify-end sm:hidden dark:text-white'>
        <X onClick={() => setOpen(false)}/>
      </div>

      {/* Section Département */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-mediumBlue dark:text-blue-300 mb-3">
          {t('department')}
        </h3>
        <nav className="flex flex-col gap-2">
          {/* 4. Use NavLink and its className function */}
          <NavLink
            to='Departement/Add'
            onClick={() => setOpen(false)}
            className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`}
          >
            <Plus size={18}/>
            {t('add_department')}
          </NavLink>
          <NavLink
            to='Departements'
            onClick={() => setOpen(false)}
            className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`}
          >
            <Eye size={18} />
            {t('view_departments')}
          </NavLink>
        </nav>
      </div>

      {/* Section RH */}
      <div>
        <h3 className="text-lg font-semibold text-mediumBlue dark:text-blue-300 mb-3">
          {t('rh')}
        </h3>
        <nav className="flex flex-col gap-2">
          <NavLink
            to='HR/Add'
            onClick={() => setOpen(false)}
            className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`}
          >
            <Plus size={18} />
            {t('add_rh')}
          </NavLink>
          <NavLink
            to="HRs"
            onClick={() => setOpen(false)}
            className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`}
            // Use 'end' prop for parent routes to prevent it from matching child routes (like HR/Add)
            end 
          >
            <Users size={18} />
            {t('view_rh')}
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}