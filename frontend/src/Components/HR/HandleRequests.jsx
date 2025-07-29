import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function HandleRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {t} = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  let delay = 200;

  const fetchRequests = async () => {
    try{
      const res = await axios.get('http://localhost:4000/api/conge/getAllLeaveRequests', {
        withCredentials:true
      });
      console.log(res.data.conges);
      setRequests(res.data.conges);
      setIsLoading(false);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  if(isLoading){
    return(
      <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-lg italic mt-10 gap-2">
        {/* Spinner element: a div shaped as a circle with a spinning border */}
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

        {/* Loading text translated */}
        {t('loading')}
      </div>
    )
  }

  const filteredRequests = requests.filter( request => `${request.employee.prenom} ${request.employee.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) );

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-mediumBlue dark:text-politeBlue mb-10 mt-5" data-aos='fade-right'>
        {t("request_pending_title")}
      </h2>
      <input 
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border-2 px-4 py-2 rounded-md w-full md:w-1/2 border-mediumBlue/90 dark:bg-blue-950/50 dark:border-lightBlue dark:text-white mb-8 outline-none focus:border-gray-600 dark:focus:border-gray-200"
        placeholder={t("search_by_name")}
        data-aos="fade-right" data-aos-delay='200'
       />

      {requests.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg italic mt-10">
          {t('no_pending_message')}
        </p>
      ) : (filteredRequests.length === 0 ?
            (
              <p className="text-center text-gray-600 dark:text-gray-300 text-lg italic mt-10">
                {t('no_matching_requests')}
              </p>
            ) :
            (
              <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredRequests.map((request, index) => {
                  delay += 200;
                  return(
                    <div
                      key={request._id}
                      className="relative bg-white dark:bg-blue-950/50 rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow space-y-3"
                      data-aos="zoom-in" data-aos-delay={delay}
                    >
                      {/* Nom complet */}
                      <h3 className="text-lg font-semibold text-blue-800 dark:text-gray-200">
                        {request.employee.prenom} {request.employee.nom}
                      </h3>

                      {/* Email avec label */}
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">{t('leave_type_label')} :</span> {t(request.motif.type)}
                      </p>

                      {/* Boutons d'action */}
                      <div className="flex justify-end gap-4 mt-4">
                        <button
                          className="text-mediumBlue dark:text-lightBlue hover:text-darkBlue dark:hover:text-mediumBlue cursor-pointer "
                          title={t('view_request_button')}
                          onClick={() => navigate(`Details/${request._id}`)}
                        >
                          {t('view_request_button')}
                        </button>
                      </div>
                    </div>
                  )
                })}

              </div>
            )
      )}
    </div>
  )
}
