import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function WebSiteName() {

  const navigate = useNavigate();

  return (
    <div className='font-bold text-2xl sm:text-3xl text-mediumBlue dark:text-zinc-200 cursor-pointer'
        onClick={() => navigate('/')}
    >
      RHPlus
    </div>
  )
}
