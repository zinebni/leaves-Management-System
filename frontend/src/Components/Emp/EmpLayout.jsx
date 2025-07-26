import { CalendarDays} from 'lucide-react';
import React, { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom';
import NavBar from '../Organisation/NavBar';
import SideBar from '../Organisation/SideBar';

export default function EmpLayout() {
  const { orgID } = useParams();
  const [open, setOpen] = useState(false);
  const sidebarLinks = [
    {
      section: 'leaves',
      items: [
        { to: 'Request-leave', icon: <CalendarDays size={18} />, label: 'request_leave' }
      ],
    }
  ];

  return (
    <div className='w-full overflow-x-hidden'>
      <NavBar name={orgID} open={open} setOpen={setOpen} />
      <div className='flex flex-col min-h-screen sm:flex-row'>
        <SideBar name={orgID} open={open} setOpen={setOpen} links={sidebarLinks} role='Employee' gap={72} />
        <div className='flex-grow dark:bg-blue-950/83'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
