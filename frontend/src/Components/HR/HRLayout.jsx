import { ClipboardCheck, Eye, icons, Inbox, Plus } from 'lucide-react';
import React, { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom';
import NavBar from '../Organisation/NavBar';
import SideBar from '../Organisation/SideBar';

export default function HRLayout() {
  const { orgID } = useParams();
  const [open, setOpen] = useState(false);

  const sidebarLinks = [
    { to: 'Employee/Add', icon: Plus, label: 'add_emp' },
    { to: 'Employees', icon: Eye, label: 'list_emp' },
    { to: 'Requests', icon: Inbox, label: 'handle_request' },
    { to: 'Processed-Requests', icon: ClipboardCheck, label: 'processed_requests' },
    { to: 'Event/Add', icon: Plus, label: 'add_event'}
  ];

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-50 dark:bg-blue-950/89">
      {/* ✅ Navbar fixée en haut */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar name={orgID} open={open} setOpen={setOpen} />
      </div>

      {/* ✅ Layout en dessous de la navbar */}
      <div className="pt-[64px] flex h-full">
        {/* ✅ Sidebar : fixe à gauche sur desktop, en overlay sinon */}
        <div className="hidden sm:block fixed top-[64px] bottom-0 left-0 w-[250px] z-40">
          <SideBar open={open} setOpen={setOpen} links={sidebarLinks} gap={52} />
        </div>

        {/* ✅ Sidebar mobile : en overlay */}
        {open && (
          <div className="sm:hidden fixed inset-0 z-50 ">
            <SideBar open={open} setOpen={setOpen} links={sidebarLinks} gap={52} />
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


