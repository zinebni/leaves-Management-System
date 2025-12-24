import { CalendarDays, History } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api';
import socket from '../../socket.js';
import NavBar from '../Organisation/NavBar';
import SideBar from '../Organisation/SideBar';

export default function EmpLayout() {
  const { orgID , employeeId} = useParams();
  const [open, setOpen] = useState(false);
  const [nbrNotif, setNbrNotif] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const { t } = useTranslation();

  const fetchNbrNotif = async () => {
    try{
      const res = await api.get('/api/notification/getNotifications');
      setNbrNotif(res.data.notifications.length);
    } catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchNbrNotif();
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

      // Incrementer le compteur de notifications
      setNbrNotif(prev => prev + 1);

      // Déclencher l'animation shake
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 1000);

      // Afficher un toast de notification
      toast.info(
        <div className="flex items-center gap-2">
          <span>🔔</span>
          <span>{t('notification.new_notification_received') || 'Nouvelle notification reçue!'}</span>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    });

    return () => {
      socket.off("newNotification"); // propre : évite doublons si le layout est rechargé
    };
  }, [t]);


  const sidebarLinks = [
    { to: 'Request-leave', icon: CalendarDays, label: 'request_leave' },
    { to: 'Historic' , icon: History, label: 'leave_history'}
  ];

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-50 dark:bg-blue-950/89">
      {/* Toast container pour les notifications */}
      <ToastContainer />

      {/* ✅ Navbar fixée en haut */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar name={orgID} open={open} setOpen={setOpen} nbrNotif={nbrNotif} setNbrNotif={setNbrNotif} isNotif={true} isShaking={isShaking}/>
      </div>

      {/* ✅ Layout en dessous de la navbar */}
      <div className="pt-[64px] flex h-full">
        {/* ✅ Sidebar : fixe à gauche sur desktop, en overlay sinon */}
        <div className="hidden sm:block fixed top-[64px] bottom-0 left-0 w-[250px] z-40">
          <SideBar open={open} setOpen={setOpen} links={sidebarLinks} gap={80} haveAccount={true}/>
        </div>

        {/* ✅ Sidebar mobile : en overlay */}
        {open && (
          <div className="sm:hidden fixed inset-0 z-50 ">
            <SideBar open={open} setOpen={setOpen} links={sidebarLinks} gap={80} haveAccount={true}/>
          </div>
        )}

        {/* ✅ Contenu scrollable */}
        <main className="flex-1 ml-0 sm:ml-[250px] mt-5 sm:mt-[10px] h-[calc(100vh-64px)] overflow-y-auto px-6 sm:px-20 pt-10 sm:pt-6 pb-32 sm:pb-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
