import axios from 'axios';
import { Pencil, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function DisplayEmp() {
  const [employees, setEmployees] = useState([]);
  const [depts, setDepts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDept, setSearchDept] = useState('');

  const { t } = useTranslation();

  const fetchDepts = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/department/getDepartments', {
        withCredentials: true
      });
      setDepts(res.data.departments);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/employee/getEmployeesByRole/employe', {
        withCredentials: true
      });
      setEmployees(res.data.employees.reverse());
      setIsLoading(false);
    } catch (error) {
      console.log(`Error fetching employees: ${error}`);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/employee/deleteEmployeeById/${id}`, {
        withCredentials: true
      });
      fetchEmployees();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredEmployeesCount = employees.filter((emp) =>
    (!searchDept || (emp.department && emp.department._id === searchDept)) &&
    (`${emp.prenom} ${emp.nom}`.toLowerCase().includes(searchTerm.toLowerCase()))
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-lg italic mt-10 gap-2">
        <div className="w-5 h-5 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
        {t('loading')}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <div className="w-full mb-8 flex justify-center items-center">
        <h2 className="text-2xl font-bold text-mediumBlue dark:text-politeBlue mb-2 mt-5">
          {t("emp_list_title")}
        </h2>
      </div>

      {/* 🔍 Search Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 w-full max-w-4xl justify-center">
        <input
          type="text"
          placeholder={t("search_by_name")}
          className="border-2 px-4 py-2 rounded-md w-full md:w-1/2 border-mediumBlue/90 dark:bg-blue-950/50 dark:border-lightBlue dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border-2 px-4 py-2 rounded-md w-full md:w-1/2 border-mediumBlue/90 dark:bg-blue-950/50 dark:border-lightBlue dark:text-white"
          value={searchDept}
          onChange={(e) => setSearchDept(e.target.value)}
        >
          <option value="">{t("all_departments")}</option>
          {depts.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.nom}
            </option>
          ))}
        </select>
      </div>

      {employees.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg italic mt-10">
          {t('no_emp_message')}
        </p>
      ) : (
        <>
          {filteredEmployeesCount === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300 text-lg italic mt-10">
              {t('no_matching_employees')}
            </p>
          ) : (
            depts.map((dept) => {
              if (searchDept && searchDept !== dept._id) return null;

              const employeesInDept = employees.filter((emp) =>
                emp.department &&
                emp.department._id === dept._id &&
                (`${emp.prenom} ${emp.nom}`.toLowerCase().includes(searchTerm.toLowerCase()))
              );

              if (employeesInDept.length === 0) return null;

              return (
                <div key={dept._id} className="w-full max-w-6xl mb-10">
                  <div className="w-full flex justify-center">
                    <h3 className="text-xl font-bold text-left text-darkBlue dark:text-lightBlue mb-4 italic">
                      {dept.nom}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {employeesInDept.map((employee) => (
                      <div
                        key={employee._id}
                        className="relative bg-white dark:bg-blue-950/50 rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow space-y-3"
                      >
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-gray-200">
                          {employee.prenom} {employee.nom}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Email :</span> {employee.email}
                        </p>
                        <div className="flex justify-end gap-4 mt-4">
                          <button
                            className="text-mediumBlue dark:text-lightBlue hover:text-darkBlue dark:hover:text-mediumBlue cursor-pointer"
                            title={t("edit")}
                            onClick={() => window.location.href = `Employees/Edit/${employee._id}`}
                          >
                            <Pencil />
                          </button>
                          <button
                            onClick={() => handleDelete(employee._id)}
                            className="text-red-600 hover:text-red-800 dark:hover:text-red-700 cursor-pointer"
                            title={t("delete")}
                          >
                            <Trash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </>
      )}
    </div>
  );
}
