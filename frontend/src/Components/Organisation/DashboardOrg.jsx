import React from 'react'
import { useParams } from 'react-router-dom'
import NavBarOrg from './NavBarOrg';
import SideBarOrg from './SideBarOrg';

export default function DashboardOrg() {
  const {orgID} = useParams();
  
  return (
    <div>
      <NavBarOrg name={orgID} />
      <div>
        <SideBarOrg  currentPage={null} name={orgID} />
      </div>
    </div>
  )
}
