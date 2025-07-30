import axios from 'axios';
import { Pencil, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function DisplayDept({open}) {
  const [departments, setDepartments] = useState([]);
  const { t } = useTranslation();
  const [editable, setEditable] = useState(-1);
  const [newDept, setNewDept] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);


  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/department/getDepartments', {
        withCredentials: true
      });
      setDepartments(res.data.departments);
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleUpdate = async (id, updatedDept) => {
    try {
      await axios.put(`http://localhost:4000/api/department/updateDepartment/${id}`, updatedDept, {
        withCredentials: true
      });
      setNewDept({});

      setDepartments(prev =>
        prev.map(d => (d._id === id ? { ...d, ...updatedDept } : d))
      );
      setEditable(-1);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(t("delete_confirm"));
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:4000/api/department/deleteDepartment/${id}`, {
        withCredentials: true
      });
      setDepartments(departments.filter((dept) => dept._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

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
      <h2 className="text-xl sm:text-2xl font-bold text-mediumBlue dark:text-politeBlue mb-10 mt-5" data-aos="fade-right">
        {t("department_list")}
      </h2>

      {departments.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg italic mt-10">
          {t('no_departments')}
        </p>
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" data-aos="zoom-in" delay='400'>
          {departments.map((dept, index) => {
            if (index === editable) {
               return (
              <div
                key={`${dept._id}-edit`} 
                className="relative bg-white dark:bg-blue-950/50 rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow grid grid-cols-1 gap-3"
              >
                <input
                  type="text"
                  defaultValue={dept.nom}
                  onChange={(e) => setNewDept(prev => ({...prev, nom:e.target.value}))}
                  className="px-3 py-3 rounded-lg border-2 focus:border-mediumBlue outline-none bg-zinc-100 border-gray-600 w-full"
                />
                <textarea
                  defaultValue={dept.description}
                  onChange={(e) => setNewDept(prev => ({...prev, description:e.target.value}))}
                  className="px-3 py-3 rounded-lg border-2 focus:border-mediumBlue outline-none bg-zinc-100 border-gray-600 w-full"
                />
                <div className="flex justify-end gap-3 mt-2">
                  <button
                    onClick={() => handleUpdate(dept._id, newDept)}
                    className='text-base sm:text-[17px] font-semibold bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700 py-2 text-white rounded-lg sm:rounded-lg mb-2 cursor-pointer hover:bg-blue-600 px-3'
                  >
                    {t("save")}
                  </button>
                  <button
                    onClick={() => setEditable(-1)}
                    className='text-base sm:text-[17px] font-semibold bg-gray-700 hover:bg-gray-800 dark:bg-gray-400 dark:text-gray-900 dark:hover:bg-gray-300 py-2 text-white rounded-lg sm:rounded-lg mb-2 cursor-pointer px-3'
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            );
            }

            return (
              <div
                key={dept._id}
                className="relative bg-white dark:bg-blue-950/50 rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow grid grid-cols-2  gap-3"
              >
                <h3 className="text-xl font-semibold text-blue-800 dark:text-gray-200">{dept.nom}</h3>
                <button
                  onClick={() => handleDelete(dept._id)}
                  className="text-red-600 hover:text-red-800 dark:hover:text-red-700 cursor-pointer flex justify-end"
                  title={t("delete")}
                >
                  <Trash />
                </button>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {dept.description || t("no_description")}
                </p>
                <button
                  onClick={() => setEditable(index)}
                  className="text-mediumBlue dark:text-lightBlue hover:text-darkBlue dark:hover:text-mediumBlue cursor-pointer flex justify-end"
                  title={t("edit")}
                >
                  <Pencil />
                </button>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );

}
