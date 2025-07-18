import React from 'react'
import WebSiteName from '../WebSiteName';
import LanguageSwitcher from '../../i18n/LanguageSwitcher';
import DarkMode from '../DarkMode'
import { Menu } from 'lucide-react';

export default function NavBar({name, open, setOpen}) {
  return (
    <div className={`bg-lightBlue/50 flex items-start sm:items-end justify-between px-5 sm:px-8 py-4 shadow-lg shadow-blue-50 border-b-2 border-lightBlue/70 dark:border-blue-950 dark:bg-blue-950/90 ${open ? 'hidden' : ''}`}>
      <div className='sm:flex sm:items-end gap-5'>
        <WebSiteName />
        <span className='text-lg font-semibold text-zinc-700 dark:text-zinc-300'>
          {name}
        </span>
      </div>
      <div className='flex items-center gap-3'>
        <LanguageSwitcher />
        <DarkMode />
        <Menu className='block sm:hidden dark:text-gray-100'
          onClick={() => setOpen(true)}
        />
      </div>
    </div>
  )
}
