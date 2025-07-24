import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function HandleRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try{
      const res = await axios.get('http://localhost:4000/api/conge/getAllLeaveRequests', {
        withCredentials:true
      });
      console.log(res);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>HandleRequests</div>
  )
}
