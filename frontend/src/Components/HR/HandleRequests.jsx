import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

export default function HandleRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {t} = useTranslation();

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

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-mediumBlue dark:text-politeBlue mb-10 mt-5">
        {t("request_pending_title")}
      </h2>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg italic mt-10">
          {t('no_pending_message')}
        </p>
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {requests.map((request, index) => (
            <div
              key={request._id}
              className="relative bg-white dark:bg-blue-950/50 rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow space-y-3"
            >
              {/* Nom complet */}
              <h3 className="text-lg font-semibold text-blue-800 dark:text-gray-200">
                {request.prenom} {request.nom}
              </h3>

              {/* Email avec label */}
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Email :</span> {hr.email}
              </p>

              {/* Boutons d'action */}
              <div className="flex justify-end gap-4 mt-4">
                <button
                  className="text-mediumBlue dark:text-lightBlue hover:text-darkBlue dark:hover:text-mediumBlue cursor-pointer "
                  title={t("edit")}
                  onClick={() => window.location.href = `HRs/Edit/${hr._id}`}
                >
                  <Pencil />
                </button>
                <button
                  onClick={() => handleDelete(hr._id)}
                  className="text-red-600 hover:text-red-800 dark:hover:text-red-700 cursor-pointer"
                  title={t("delete")}
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  )
}
