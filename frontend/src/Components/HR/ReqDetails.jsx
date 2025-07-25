import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom'

export default function ReqDetails() {
  const {id} = useParams();
  const [congeDetails, setCongeDetails] = useState({});
  const {t} = useTranslation();

  const fetchDetails = async () => {
    try{
      const res = await axios.get(`http://localhost:4000/api/conge/getLeaveRequestById/${id}`, {
        withCredentials:true
      });

      console.log(res.data.data);
      setCongeDetails(res.data.data);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className='flex justify-center items-center mt-10'>
      <div className='grid grid-cols-1 gap-5 pl-10 pr-8 py-5 bg-gray-100 rounded-2xl mt-10'>
        <h3>
          {t('Employee Profile')}
        </h3>
        <p>
          {`${t('fullname_label')} : ${congeDetails.conge?.employee.prenom}  ${congeDetails.conge?.employee.nom}`}
        </p>
        <p>
          {`${t('dept')} : ${congeDetails.conge?.employee.department}`}
        </p>
        <p>
          {`${t('family_situation')} : ${congeDetails.conge?.employee.department}`}
        </p>
        <p>
          {`${t('child_number_placeholder')} : ${congeDetails.conge?.employee.department}`}
        </p>
      </div>
    </div>
  )
}
