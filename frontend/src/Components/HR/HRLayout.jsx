import { Eye, icons, Inbox, Plus } from 'lucide-react';
import React, { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom';
import NavBar from '../Organisation/NavBar';
import SideBar from '../Organisation/SideBar';

export default function HRLayout() {
  const { orgID } = useParams();
  const [open, setOpen] = useState(false);
  const sidebarLinks = [
    {
      section: 'emp',
      items: [
        { to: 'Employee/Add', icon: <Plus size={18} />, label: 'add_emp' },
        { to: 'Employees', icon: <Eye size={18} />, label: 'view_emps' } // ❌ Sans "end", ce lien sera aussi actif pour les sous-routes comme 'Employees/Add',
      ],
    }, {
      section: 'request',
      items: [
        { to: 'Requests', icons: <Inbox size={18} />, label: 'handle_request'}
      ]
    }
  ];

  return (
    <div className='w-full overflow-x-hidden'>
      <NavBar name={orgID} open={open} setOpen={setOpen} />
      <div className='flex flex-col min-h-screen sm:flex-row'>
        <SideBar name={orgID} open={open} setOpen={setOpen} links={sidebarLinks} role='rh' />
        <div className='flex-grow bg-gradient-to-br from-gray-300 to-white dark:bg-blue-950/60 dark:from-blue-950/60 dark:to-blue-950/60'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
