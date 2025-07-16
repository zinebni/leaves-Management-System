import { Eye, Plus, Users, X } from 'lucide-react';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function SideBarOrg({currentPage, name, open, setOpen}) {

  const {t} = useTranslation();
  return (
    <aside className={`h-fit sm:h-screen fixed sm:static top-0 left-0 z-50 w-full sm:w-64 bg-lightBlue/50 text-gray-800  dark:text-gray-200 sm:dark:bg-blue-950/90  p-6 shadow-lg ${open ? 'block bg-politeBlue dark:bg-blue-950' : 'hidden'} sm:block`}>

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
          <Link
            to={`/Departement/Add/${name}`}
            className={`flex items-center gap-2 hover:bg-lightBlue dark:hover:bg-blue-800 p-2 rounded transition font-semibold 
                        ${currentPage === 'DeptAdd' ? 'text-mediumBlue dark:text-blue-300' : ''}`}
          >
            <Plus size={18}/>
            {t('add_department')}
          </Link>
          <Link
            to="/afficher-departements"
            className="flex items-center gap-2 hover:bg-lightBlue p-2 rounded transition dark:hover:bg-blue-800 font-semibold"
          >
            <Eye size={18} />
            {t('view_departments')}
          </Link>
        </nav>
      </div>

      {/* Section RH */}
      <div>
        <h3 className="text-lg font-semibold text-mediumBlue dark:text-blue-300 mb-3">
          {t('rh')}
        </h3>
        <nav className="flex flex-col gap-2">
          <Link
            to={`/HR/Add/${name}`}
            className={`flex items-center gap-2 hover:bg-lightBlue dark:hover:bg-blue-800 p-2 rounded transition font-semibold 
                        ${currentPage === 'HRAdd' ? 'text-mediumBlue dark:text-blue-300' : ''}`}
          >
            <Plus size={18} />
            {t('add_rh')}
          </Link>
          <Link
            to="/afficher-rh"
            className="flex items-center gap-2 hover:bg-lightBlue p-2 rounded transition dark:hover:bg-blue-800 font-semibold"
          >
            <Users size={18} />
            {t('view_rh')}
          </Link>
        </nav>
      </div>
    </aside>
  );

}
