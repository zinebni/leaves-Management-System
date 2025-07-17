import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import NavBarOrg from '../Organisation/NavBarOrg';
import SideBarOrg from '../Organisation/SideBarOrg';
import DisplayDept from './DisplayDept';

export default function DisplayDeptPage() {
  const {orgID} = useParams();
  const [open, setOpen] = useState(false);

  return (
    <div className='w-full overflow-x-hidden'>
      <NavBarOrg name={orgID} open={open} setOpen={setOpen} />
      <div className='flex flex-col min-h-screen sm:flex-row'>
        <SideBarOrg currentPage={'DeptView'} name={orgID} open={open} setOpen={setOpen}/>
        {/* flex-grow only works inside a flex container (i.e., a parent with display: flex).
        It tells the element to grow and take up available space.
        It applies horizontally by default (because flex is row direction by default). */}
        <div className="flex-grow bg-gradient-to-br from-gray-300 to-white dark:bg-blue-950/60 dark:from-blue-950/60 dark:to-blue-950/60">
          <DisplayDept open={open} />
        </div>
      </div>
    </div>
  )
}
