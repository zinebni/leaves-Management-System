import axios from 'axios';
import { Pencil, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

export default function DisplayHR() {

  const [hrs, setHrs] = useState([]);
  const {t} = useTranslation();

  useEffect(() => {
    const fetchHRs = async () => {
      try{
        const res = await axios.get('http://localhost:4000/api/employee/getEmployeesByRole/RH', {
          withCredentials: true
        })
        setHrs(res.data.employees);
        console.log(res.data.employees);
      } catch(error) {
        console.log(`Error fetching HR : ${error}`);
      }
    }

    fetchHRs();

  }, []);

  const handleDelete = async (id) => {
    try{
      const res = await axios.delete(`http://localhost:4000/api/employee/deleteEmployeeById/${id}`, {
        withCredentials: true
      });
      console.log(res);
    } catch(error){
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-mediumBlue dark:text-politeBlue mb-10 mt-5">
        {t("hr_list_title")}
      </h2>

      {hrs.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg italic mt-10">
          {t('no_hr_message')}
        </p>
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {hrs.map((hr, index) => (
            <div
  key={hr._id}
  className="relative bg-white dark:bg-blue-950/50 rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow space-y-3"
>
  {/* Nom complet */}
  <h3 className="text-lg font-semibold text-blue-800 dark:text-gray-200">
    {hr.prenom} {hr.nom}
  </h3>

  {/* Email avec label */}
  <p className="text-sm text-gray-700 dark:text-gray-300">
    <span className="font-medium">Email :</span> {hr.email}
  </p>

  {/* Boutons d'action */}
  <div className="flex justify-end gap-4 mt-4">
    <button
      className="text-mediumBlue dark:text-lightBlue hover:text-darkBlue dark:hover:text-mediumBlue"
      title={t("edit")}
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
