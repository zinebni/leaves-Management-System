import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

export default function EmpEnChauv() {
  const {id} = useParams();
  const [employesOnLeave, setEmployesOnLeave] = useState([]);
  const [approvers, setApprovers] = useState({}); // will hold RH data by id
  const [isLoading, setIsLoading] = useState(true);
  const {t} = useTranslation();
  const navigate = useNavigate();
  let delay = 0;

  // Fetch leave request and employees on leave
  const fetchDetails = async () => {
    try{
      const res = await axios.get(`http://localhost:4000/api/conge/getLeaveRequestById/${id}`, {
        withCredentials:true
      });
      const employees = res.data.data.employeesConge || [];
      setEmployesOnLeave(employees);

      // Extract unique approver IDs
      const approverIds = [...new Set(employees.map(e => e.approuvePar).filter(Boolean))];

      if (approverIds.length > 0) {
        // Fetch all RH data by batch
        const approversData = {};
        //Promise.all is used to run multiple asynchronous operations in parallel instead of sequentially, which improves performance.
        await Promise.all(
          approverIds.map(async (approverId) => {
            const rhRes = await axios.get(`http://localhost:4000/api/employee/getEmployeeById/${approverId}`, {
              withCredentials: true
            });
            approversData[approverId] = rhRes.data.employee;
          })
        );
        setApprovers(approversData);
      }

      setIsLoading(false);
    } catch(error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDetails();
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
          {t("overlapping_leave_title")}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl" data-aos='zoom-in' data-aos-delay='200'>
        {employesOnLeave?.map((item) => {
          const approver = approvers[item.approuvePar]; // get RH info
          return (
            <div
              key={item._id}
              className="flex flex-col gap-2 rounded-2xl p-5 bg-white dark:bg-blue-950/50 shadow-md text-base sm:text-[17px]"
            >
              <p className="font-semibold text-gray-700 dark:text-white text-lg">
                <span className="filter brightness-125 dark:brightness-150">👤</span>
                {item.employee?.prenom} {item.employee?.nom}
              </p>
              
              <p className="text-gray-600 dark:text-gray-300">
                <span className='mr-1'>📞</span>
                {
                  item.employee.numeroDeContact?
                  item.employee.numeroDeContact
                  : t('not_available')
                }
              </p>

              {item.employee?.verificationEmail && (
                <p className="text-gray-600 dark:text-gray-300">
                  📧 {item.employee.verificationEmail}
                </p>
              )}

              <p className="text-gray-600 dark:text-gray-300">
                📅 {t('start_date')}: {new Date(item.date_debut).toLocaleDateString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                📅 {t('end_date')}: {new Date(item.date_fin).toLocaleDateString()}
              </p>

              <p className="text-gray-600 dark:text-gray-300">
                📝 {t('leave_type')}: {t(item.motif?.type)}
              </p>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                ✅ {t('approved_by')}: {approver.prenom} {approver.nom}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
