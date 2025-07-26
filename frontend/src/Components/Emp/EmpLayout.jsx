import { CalendarDays} from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom';
import NavBar from '../Organisation/NavBar';
import SideBar from '../Organisation/SideBar';
import socket from '../../socket.js';

export default function EmpLayout() {
  const { orgID , employeeId} = useParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (employeeId) {
      socket.emit('joinRoom', employeeId);
      console.log('🧠 Socket connecté à la room :', employeeId);
    }

    // Cleanup si nécessaire
    return () => {
      socket.emit('leaveRoom', employeeId);
    };
  }, [employeeId]);

  useEffect(() => {
    socket.on("newNotification", (data) => {
      console.log("🔔 Notification reçue :", data);
      // ici tu fais un setNotificationState ou toast ou autre
    });

    return () => {
      socket.off("newNotification"); // propre : évite doublons si le layout est rechargé
    };
  }, []);


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
        <SideBar name={orgID} open={open} setOpen={setOpen} links={sidebarLinks} role='Employee' />
        <div className='flex-grow dark:bg-blue-950/83'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
