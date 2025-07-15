import React from 'react'
import { useParams } from 'react-router-dom'

export default function DashboardOrg() {
  const {orgID} = useParams();

  return (
    <div>
      {orgID}
    </div>
  )
}
