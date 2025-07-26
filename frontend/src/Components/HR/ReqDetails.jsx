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
    <div className='flex flex-col justify-center items-center'>
      <h2 className="text-2xl font-bold text-mediumBlue dark:text-politeBlue mb-10 mt-8" data-aos="fade-right">
        {t("leave_request_details")}
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 px-10'>
        <div className='flex flex-col gap-3 pl-10 pr-8 py-5 bg-gray-100 dark:bg-blue-950/50 dark:text-white rounded-xl border border-gray-300 dark:border-gray-500' data-aos="fade-up" data-aos-delay='400'>
          <h3 className='font-semibold text-lg text-mediumBlue dark:text-politeBlue mb-2'>
            {t('Employee Profile')}
          </h3>
          <p>
            <span className='font-semibold text-gray-800'>
              {t('fullname_label')}
            </span>
            {` : ${congeDetails.conge?.employee.prenom}  ${congeDetails.conge?.employee.nom}`}
          </p>
          <p>
            <span className='font-semibold text-gray-800'>
              {t('dept')}
            </span>
            {` : ${congeDetails.conge?.employee.department.nom}`}
          </p>
          <p>
            <span className='font-semibold text-gray-800'>
              {t('family_situation')}
            </span>
            {` : ${congeDetails.conge?.employee.situationFamiliale}`}
          </p>
          <p>
            <span className='font-semibold text-gray-800'>
              {t('child_number_placeholder')}
            </span>
            {` : ${congeDetails.conge?.employee.nombreEnfants}`}
          </p>
        </div>
        <div className='flex flex-col gap-3 pl-10 pr-8 py-5 bg-gray-100 dark:bg-blue-950/50 dark:text-white rounded-xl border border-gray-300 dark:border-gray-500' data-aos="fade-up" data-aos-delay="800">
          <h3 className='font-semibold text-lg text-mediumBlue dark:text-politeBlue mb-2'>
            {t('request_details')}
          </h3>
          <p>
            <span className='font-semibold text-gray-800'>
              {t('leave_type_label')}
            </span>
            {` : ${t(congeDetails.conge?.motif.type)}`}
          </p>
          {
            congeDetails.conge?.motif.hasOwnProperty('joursAutorisee') ?
            (
              <p>
                <span className='font-semibold text-gray-800'>
                  {t('remaining_days')}
                </span>
                {` : ${congeDetails.conge?.motif.joursAutorisee - congeDetails.conge?.motif.joursPris}`}
              </p>
            ) :
            (
              <p>
                <span className='font-semibold text-gray-800'>
                  {t('taken_days')}
                </span>
                {` : ${congeDetails.conge?.motif.joursPris}`}
              </p>
            )
          }
          <p>
            <span className='font-semibold text-gray-800'>
              {t('leave_payment_label')}
            </span>
            {` : ${congeDetails.conge?.motif.estPaye ? t('leave_paid') : t('leave_unpaid')}`}
          </p>
          <p>
            <span className='font-semibold text-gray-800'>
              {t('number_of_days')}
            </span>
            {` : ${congeDetails.conge?.nombreDeJours}`}
          </p>
          <p>
            <span className='font-semibold text-gray-800'>
              {t('start_date')}
            </span>
            {` : ${new Date(congeDetails.conge?.date_debut).toLocaleDateString()}`}
          </p>
          <p>
            <span className='font-semibold text-gray-800'>
              {t('end_date')}
            </span>
            {` : ${new Date(congeDetails.conge?.date_fin).toLocaleDateString()}`}
          </p>
          {
            congeDetails.conge?.hasOwnProperty('commentaire') ?
            (
              <p>
                <span className='font-semibold text-gray-800'>
                  {t('comment')}
                </span>
                {` : ${congeDetails.conge?.commentaire}`}
              </p>
            ) : null
          }
        </div>
      </div>
    </div>
  )
}
