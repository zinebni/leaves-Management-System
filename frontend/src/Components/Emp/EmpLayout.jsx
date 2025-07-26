import { CalendarDays} from 'lucide-react';
import React, { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom';
import NavBar from '../Organisation/NavBar';
import SideBar from '../Organisation/SideBar';

export default function EmpLayout() {
  const { orgID } = useParams();
  const [open, setOpen] = useState(false);
  const sidebarLinks = [
    { to: 'Request-leave', icon: CalendarDays, label: 'request_leave' }
  ];

  return (
    <div className='w-full flex flex-col min-h-screen overflow-x-hidden bg-gray-50 dark:bg-blue-950/89'>
      <NavBar name={orgID} open={open} setOpen={setOpen} />
      <div className='flex flex-col min-h-screen sm:flex-row'>
        <SideBar name={orgID} open={open} setOpen={setOpen} links={sidebarLinks} role='Employee' gap={96} />
        <div className='flex-grow'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
