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
    {
      section: 'department',
      items: [
        { to: 'Departement/Add', icon: <Plus size={18} />, label: 'add_department' },
        { to: 'Departements', icon: <Eye size={18} />, label: 'view_departments' },
      ],
    },
    {
      section: 'rh',
      items: [
        { to: 'HR/Add', icon: <Plus size={18} />, label: 'add_rh' },
        { to: 'HRs', icon: <Users size={18} />, label: 'view_rh', end: true },
      ],
    },
  ];

  return (
    <div className='w-full overflow-x-hidden'>
      <NavBar name={orgID} open={open} setOpen={setOpen} />
      <div className='flex flex-col min-h-screen sm:flex-row'>
        <SideBar name={orgID} open={open} setOpen={setOpen} links={sidebarLinks} />
        <div className='flex-grow bg-gradient-to-br from-gray-300 to-white dark:bg-blue-950/60 dark:from-blue-950/60 dark:to-blue-950/60'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
