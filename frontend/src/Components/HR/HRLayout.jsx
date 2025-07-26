import { Eye, icons, Inbox, Plus } from 'lucide-react';
import React, { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom';
import NavBar from '../Organisation/NavBar';
import SideBar from '../Organisation/SideBar';

export default function HRLayout() {
  const { orgID } = useParams();
  const [open, setOpen] = useState(false);
  const sidebarLinks = [
    { to: 'Employee/Add', icon: Plus , label: 'add_emp' },
    { to: 'Employees', icon: Eye , label: 'list_emp' }, // ❌ Sans "end", ce lien sera aussi actif pour les sous-routes comme 'Employees/Add',
    { to: 'Requests', icon: Inbox , label: 'handle_request'}
  ];

  return (
    <div className='w-full flex flex-col min-h-screen overflow-x-hidden bg-gray-50 dark:bg-blue-950/89'>
      <NavBar name={orgID} open={open} setOpen={setOpen} />
      <div className='flex flex-col  sm:flex-row'>
        <SideBar name={orgID} open={open} setOpen={setOpen} links={sidebarLinks} gap={72} />
        <div className='flex-grow'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
