import axios from 'axios';
import { Pencil, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function DisplayDept({open}) {
  const [departments, setDepartments] = useState([]);
  const { t } = useTranslation();
  const [editable, setEditable] = useState(-1);
  const [newDept, setNewDept] = useState({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/department/getDepartments', {
        withCredentials: true
      });
      setDepartments(res.data.departments);
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

  

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-mediumBlue dark:text-politeBlue mb-10 mt-5">
        {t("department_list")}
      </h2>

      {departments.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg italic mt-10">
          {t('no_departments')}
        </p>
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {departments.map((dept, index) => {
            if (index === editable) {
               return (
      <div
        key={dept._id}
        className="relative bg-white dark:bg-blue-950/50 rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow grid grid-cols-1 gap-3"
      >
        <input
          type="text"
          defaultValue={dept.nom}
          onChange={(e) => setNewDept(prev => ({...prev, nom:e.target.value}))}
          className="text-lg p-2 rounded border dark:bg-blue-900 dark:text-white"
        />
        <textarea
          defaultValue={dept.description}
          onChange={(e) => setNewDept(prev => ({...prev, description:e.target.value}))}
          className="text-sm p-2 rounded border dark:bg-blue-900 dark:text-white"
        />
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={() => handleUpdate(dept._id, newDept)}
            className="bg-mediumBlue hover:bg-darkBlue dark:bg-mediumBlue dark:hover:bg-mediumBlue/80 cursor-pointer text-white px-4 py-1 rounded"
          >
            {t("save")}
          </button>
          <button
            onClick={() => setEditable(-1)}
            className="bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 py-1 rounded cursor-pointer"
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
