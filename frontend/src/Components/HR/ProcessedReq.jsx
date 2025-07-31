import Aos from 'aos';
import axios from 'axios';
import { set } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

export default function ProcessedReq() {

  const [requests, setRequests] = useState([]);
  const [hrs, setHrs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterBy, setFilterBy] = useState('');
  const [type, setType] = useState('annuel');
  const [status, setStatus] = useState('approved');
  const [date, setDate] = useState('');
  const {t} = useTranslation();

  const fetchRequests = async () => {
    try{
      const res = await axios.get('http://localhost:4000/api/conge/getLeaveRequests', {
        withCredentials: true
      });
      const processedReq = res.data.conges.reverse();
      console.log(processedReq);
      setRequests(processedReq);
      const hrsId = [
        ... new Set(
          processedReq
          .flatMap(item => [item.approuvePar, item.refusePar])
          .filter(Boolean)
        )
      ];
      if(hrsId.length > 0){
        const hrsData = {};
        await Promise.all(
          hrsId.map(async(id) => {
            const hrRes = await axios.get(`http://localhost:4000/api/employee/getEmployeeById/${id}`, {
              withCredentials: true
            });
            hrsData[id] = hrRes.data.employee;
          })
        );
        setHrs(hrsData);
      }
    } catch(error){
      console.log(error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  const filterRequests =
    (filterBy === 'type' && type)
      ? requests.filter(item => item.motif.type === type)
      : (filterBy === 'status' && status)
      ? requests.filter(item =>
          status === 'approved' ? item.approuvePar :
          status === 'rejected' ? item.refusePar : null
        )
      : (filterBy === 'date' && date)
      ? requests.filter(item =>
          new Date(item.date_debut).toDateString() === new Date(date).toDateString() ||
          new Date(item.date_fin).toDateString() === new Date(date).toDateString()
        )
      : requests;


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
      {/* Title */}
      <div className='flex justify-center'>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-mediumBlue dark:text-politeBlue mb-10" data-aos="fade-right">
          {t("page_title_processed_requests")}
        </h2>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-8 w-full max-w-4xl justify-center">
        <select
          className="border-2 px-4 py-2 rounded-md w-full md:w-1/2 border-mediumBlue/90 dark:bg-blue-950/80 dark:border-lightBlue dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-200"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          data-aos="fade-right" data-aos-delay="200"
        >
          <option value="" disabled>{t("filter_by")}</option>
          <option value="all">{t("filter_type.all")}</option>
          <option value="type">{t('filter_type.type')}</option>
          <option value="status">{t('filter_type.status')}</option>
          <option value="date">{t('filter_type.date')}</option>
        </select>
        {
          filterBy === 'type' ?
          (
            <select
              className="border-2 px-4 py-2 rounded-md w-full md:w-1/2 border-mediumBlue/90 dark:bg-blue-950/80 dark:border-lightBlue dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-200"
              value={type}
              onChange={(e) => setType(e.target.value)}
              data-aos="fade-left"
            >
              <option value="annuel">{t('annuel')}</option>
              <option value="maternite">{t('maternite')}</option>
              <option value="paternite">{t('paternite')}</option>
              <option value="sans_solde">{t('sans_solde')}</option>
              <option value="maladie">{t('maladie')}</option>
              <option value="examen">{t('examen')}</option>
              <option value="Décès (conjoint, parent, enfant)">{t('Décès (conjoint, parent, enfant)')}</option>
              <option value="Décès (frère, sœur, beau-parent)">{t('Décès (frère, sœur, beau-parent)')}</option>
            </select>
          ) : 
          filterBy === 'status' ?
          (
            <select
              className="border-2 px-4 py-2 rounded-md w-full md:w-1/2 border-mediumBlue/90 dark:bg-blue-950/80 dark:border-lightBlue dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-200"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              data-aos="fade-left"
            >
              <option value="approved">{t('status.approved')}</option>
              <option value="rejected">{t('status.rejected')}</option>
            </select>
          ) : 
          filterBy === 'date' ? 
          (
            <input
              type="date"
              className="border-2 px-4 py-2 rounded-md w-full md:w-1/2 border-mediumBlue/90 dark:bg-blue-950/80 dark:border-lightBlue dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-200"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-aos="fade-left"
            />
          ) : null
        }        
      </div>
      {requests.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg italic mt-10">
          {t('no_processed_requests')}
        </p>
      ) : 
        (
          filterRequests.length === 0 ? 
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg italic mt-10">
            {t('no_matching_request')}
          </p> : 
          (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl" data-aos='zoom-in' data-aos-delay='600'>
              {
                filterRequests.map(item => {
                  return (
                    <div
                      key={item._id}
                      className="flex flex-col gap-1 rounded-2xl p-5 bg-white dark:bg-blue-950/50 shadow-md text-base"
                    >
                      <p className="font-semibold text-gray-700 dark:text-white text-[17px]">
                        <span className="filter brightness-125 dark:brightness-150">👤</span>
                        {item.employee?.prenom} {item.employee?.nom}
                      </p>
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
                      {
                        hrs[item.approuvePar || item.refusePar] ? (
                          <p className="text-gray-600 dark:text-gray-300 font-medium">
                            {item.approuvePar ? (
                              <>
                                ✅ {t('approved_by')}: {hrs[item.approuvePar].prenom} {hrs[item.approuvePar].nom}
                              </>
                            ) : (
                              <>
                                ❌ {t('rejected_by')}: {hrs[item.refusePar].prenom} {hrs[item.refusePar].nom}
                              </>
                            )}
                          </p>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-300 font-medium">
                            {item.approuvePar ? (
                              <>
                                ✅ {t('approved_by')}:  <span className='italic'>{t('no_longer_available')}</span>
                              </>
                            ) : (
                              <>
                                ❌ {t('rejected_by')}:  <span className='italic'>{t('no_longer_available')}</span>
                              </>
                            )}
                          </p>
                        )
                      }
                    </div>
                  );
                })
              }
            </div>
          )
        )
      }
      
    </div>
  )
}
