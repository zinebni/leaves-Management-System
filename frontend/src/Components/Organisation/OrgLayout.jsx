// Components/Organisation/OrgLayout.js
import React, { useState } from 'react'
import NavBarOrg from './NavBarOrg'
import SideBarOrg from './SideBarOrg'
import { Outlet, useParams, useLocation } from 'react-router-dom'

export default function OrgLayout() {
  const { orgID } = useParams();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className='w-full overflow-x-hidden'>
      <NavBarOrg name={orgID} open={open} setOpen={setOpen} />
      <div className='flex flex-col min-h-screen sm:flex-row'>
        <SideBarOrg name={orgID} open={open} setOpen={setOpen}/>
        <div className='flex-grow bg-gradient-to-br from-gray-300 to-white dark:bg-blue-950/60 dark:from-blue-950/60 dark:to-blue-950/60'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
