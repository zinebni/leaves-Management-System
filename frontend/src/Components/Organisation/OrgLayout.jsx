// Components/Organisation/OrgLayout.js
import React, { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import NavBar from './NavBar';
import { Eye, Plus, Users } from 'lucide-react';
import SideBar from './SideBar';

export default function OrgLayout() {
  const { orgID } = useParams();
  const [open, setOpen] = useState(false);
  const sidebarLinks = [
    { to: 'Departement/Add', icon: Plus, label: 'add_department' },
    { to: 'Departements', icon: Eye, label: 'view_departments' },
    { to: 'HR/Add', icon: Plus, label: 'add_rh' },
    { to: 'HRs', icon: Users, label: 'view_rh'},
  ];

  return (
    <div className='w-full flex flex-col min-h-screen overflow-x-hidden bg-gray-50 dark:bg-blue-950/89'>
      <NavBar name={orgID} open={open} setOpen={setOpen} />
      <div className='flex flex-col min-h-screen sm:flex-row'>
        <SideBar name={orgID} open={open} setOpen={setOpen} links={sidebarLinks}  gap={64} />
        <div className='flex-grow'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
