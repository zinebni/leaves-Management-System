import { Eye, Plus, Users } from 'lucide-react';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function SideBarOrg() {

  const {t} = useTranslation();
  return (
    <aside className="h-screen w-64 bg-lightBlue/50 text-gray-800  dark:text-gray-200 dark:bg-blue-900  p-6 shadow-lg">

      <h2 className="text-2xl font-bold mb-10">Admin</h2>

      {/* Section Département */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-mediumBlue dark:text-blue-300 mb-3">
          {t('department')}
        </h3>
        <nav className="flex flex-col gap-2">
          <Link
            to="/Departement/Add"
            className="flex items-center gap-2 hover:bg-lightBlue dark:hover:bg-blue-800 p-2 rounded transition font-semibold"
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
            to="/ajouter-rh"
            className="flex items-center gap-2 hover:bg-lightBlue p-2 rounded transition dark:hover:bg-blue-800 font-semibold"
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
