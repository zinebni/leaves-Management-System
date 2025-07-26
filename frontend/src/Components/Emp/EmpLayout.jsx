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
