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
    <div className="w-full h-screen overflow-hidden bg-gray-50 dark:bg-blue-950/89">
      {/* ✅ Navbar fixée en haut */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar name={orgID} open={open} setOpen={setOpen} isNotif={false}/>
      </div>

      {/* ✅ Layout en dessous de la navbar */}
      <div className="pt-[64px] flex h-full">
        {/* ✅ Sidebar : fixe à gauche sur desktop, en overlay sinon */}
        <div className="hidden sm:block fixed top-[64px] bottom-0 left-0 w-[250px] z-40">
          <SideBar open={open} setOpen={setOpen} links={sidebarLinks} gap={64} haveAccount={false}/>
        </div>

        {/* ✅ Sidebar mobile : en overlay */}
        {open && (
          <div className="sm:hidden fixed inset-0 z-50 ">
            <SideBar open={open} setOpen={setOpen} links={sidebarLinks} gap={64} haveAccount={false}/>
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
