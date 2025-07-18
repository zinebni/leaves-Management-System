import { X } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
// 1. Import NavLink instead of Link
import { NavLink } from 'react-router-dom';

// 2. Remove currentPage from the props
export default function SideBar({ open, setOpen, links }) {
  const { t } = useTranslation();

  const baseLinkClass = "flex items-center gap-2 hover:bg-lightBlue dark:hover:bg-blue-800 p-2 rounded transition font-semibold";
  const activeLinkClass = "text-mediumBlue dark:text-blue-300";

  return (
    <aside className={`inset-y-0 fixed sm:static top-0 left-0 z-50 w-full sm:w-64 bg-lightBlue/50 text-gray-800 dark:text-gray-200 sm:dark:bg-blue-950/90 p-6 shadow-lg ${open ? 'block bg-politeBlue dark:bg-blue-950' : 'hidden'} sm:block`}>
      <h2 className="hidden sm:block text-2xl font-bold mb-10">Admin</h2>
      <div className='flex justify-end sm:hidden dark:text-white'>
        <X onClick={() => setOpen(false)} />
      </div>

      {links.map(({ section, items }, idx) => (
        <div key={idx} className="mb-6">
          <h3 className="text-lg font-semibold text-mediumBlue dark:text-blue-300 mb-3">
            {t(section)}
          </h3>
          <nav className="flex flex-col gap-2">
            {items.map(({ to, icon, label, end = false }, i) => (
              <NavLink
                key={i}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`}
              >
                {icon}
                {t(label)}
              </NavLink>
            ))}
          </nav>
        </div>
      ))}
    </aside>
  );
}
