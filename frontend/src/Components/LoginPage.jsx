import React from 'react'
import { useParams } from 'react-router-dom'

export default function LoginPage() {
  const {role} = useParams();

  return (
    <div>
      {role}
    </div>
  )
}
