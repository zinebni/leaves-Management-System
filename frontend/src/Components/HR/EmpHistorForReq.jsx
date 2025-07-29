import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom'

export default function EmpHistorForReq() {
  const {id} = useParams();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [historic, setHistoric] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actors, setActors] = useState([]);
  let delay = 0;

  const fetchHistoric = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/conge/getLeaveRequestById/${id}`, {
        withCredentials: true
      });

      const historique = res.data.data.congesHistorique.reverse() || [];
      setHistoric(historique);
      console.log(historique);

      // Extraire tous les IDs uniques de RH (qu'ils aient approuvé ou refusé)
      const actorIds = [
        ...new Set(
          historique
            .flatMap(item => [item.approuvePar, item.refusePar])
            .filter(Boolean)
        )
      ];

      if (actorIds.length > 0) {
        const actorsData = {};

        await Promise.all(
          actorIds.map(async (actorId) => {
            const rhRes = await axios.get(`http://localhost:4000/api/employee/getEmployeeById/${actorId}`, {
              withCredentials: true
            });
            actorsData[actorId] = rhRes.data.employee;
          })
        );

        setActors(actorsData); // nouveau useState
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoric();
  }, []);

  if(isLoading){
    return(
      <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-lg italic mt-10 gap-2">
        <div 
          className="
            w-5 h-5                
            border-4                
            border-gray-400         
            border-t-transparent    
            rounded-full           
            animate-spin            
          "
        ></div>
        {t('loading')}
      </div>
    )
  }

  return (
    <div className='flex flex-col justify-center items-center px-4'>
      <div className="mb-6 w-full flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-mediumBlue dark:text-lightBlue font-semibold hover:text-blue-800 dark:hover:text-blue-200 transition cursor-pointer"
          aria-label={t('go_back_to_request')}
        >
          <ChevronLeft size={20} />
          {t('go_back_to_request')}
        </button>
      </div>

      {/* Title */}
      <div className='flex justify-center'>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-mediumBlue dark:text-politeBlue mb-10" data-aos="fade-right">
          {t("employee_leave_history_title")}
        </h2>
      </div>      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {historic.map((item, index) => {
        const actorId = item.approuvePar || item.refusePar;
        const actor = actors[actorId];
        const status = item.approuvePar ? 'approved' : item.refusePar ? 'rejected' : 'pending';
        delay += 200;
        return (
          <div
            key={item._id}
            className="flex flex-col gap-1 rounded-2xl p-5 bg-white dark:bg-blue-950/50 shadow-md text-base sm:text-[17px]"
            data-aos='zoom-in' data-aos-delay={delay}
          >
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              📅 {t('start_date')}: {new Date(item.date_debut).toLocaleDateString()}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              📅 {t('end_date')}: {new Date(item.date_fin).toLocaleDateString()}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              📆 {t('number_of_days')}: {item.nombreDeJours}
            </p>

            <p className="text-gray-600 dark:text-gray-300">
              📝 {t('leave_type')}: {t(item.motif?.type)}
            </p>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              {status === 'approved' && (
                <>
                  ✅ {t('approved_by')}: {actor.prenom} {actor.nom}
                </>
              )}
              {status === 'rejected' && (
                <>
                  ❌ {t('rejected_by')}: {actor.prenom} {actor.nom}
                </>
              )}
            </p>
          </div>
        );
        })}
      </div>
    </div>
  )
}
