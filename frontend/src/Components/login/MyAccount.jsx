import api from '../../api';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { User} from 'lucide-react';


export default function MyAccount() {

  const {rhId, employeeId} = useParams();
  const id = rhId || employeeId;
  const [info, setInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const {t, i18n } = useTranslation();
  const navigate = useNavigate();

  const moveToResetPassword = async (email) => {
   try{
      const res = await api.post('/api/auth/send-reset-otp', {
        email
      });
      console.log(res);
      localStorage.setItem('email', email);
      navigate('ResetPassword');
    } catch(error) {
      console.log(error);
    }
  }

  const fetchPersonalInfo = async () => {
    try{
      const res = await api.get(`/api/employee/getEmployeeById/${id}`);
      console.log(res.data.employee);
      setInfo(res.data.employee);
    } catch(error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchPersonalInfo();
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
  <div className="max-w-md mx-auto bg-white dark:bg-blue-950/50 rounded-2xl py-6 px-8 shadow-xl border-2 border-mediumBlue dark:border-blue-200">
    <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 text-mediumBlue dark:text-blue-200">
      <User strokeWidth={3}/>
      {t('my_account')}
    </h2>

    <div className="space-y-4 text-gray-800 dark:text-gray-200 ">
      <p><strong className='text-gray-700 dark:text-gray-300'>{t('first_name_placeholder')}:</strong> {info.prenom}</p>
      <p><strong className='text-gray-700 dark:text-gray-300'>{t('last_name_placeholder')}:</strong> {info.nom}</p>
      <p><strong className='text-gray-700 dark:text-gray-300'>Email:</strong> {info.email}</p>
        <p><strong className='text-gray-700 dark:text-gray-300'>{t('contact_placeholder')}:</strong> {info.numeroDeContact ? info.numeroDeContact : <span className='text-gray-600 italic'>{t('not_available')}</span>}</p>
      <p><strong className='text-gray-700 dark:text-gray-300'>{t('gender')}:</strong> {t(info.sexe)}</p>
      <p><strong className='text-gray-700 dark:text-gray-300'>{t('family_situation')}:</strong> {t(info.situationFamiliale.toLowerCase())}</p>
      {
        info.nombreEnfants &&
        (
          <p><strong className='text-gray-700 dark:text-gray-300'>{t('child_number_placeholder')}:</strong> {info.nombreEnfants}</p>
        )
      }
      <p><strong className='text-gray-700 dark:text-gray-300'>{t('recruitment_date')}:</strong> {new Date(info.dateDeRecrutement).toLocaleDateString(i18n.language)}</p>
      {info?.department && <p><strong className='text-gray-700 dark:text-gray-300'>{t('dep')}:</strong> {info.department?.nom}</p>}
      <p><strong className='text-gray-700 dark:text-gray-300'>{t('verification_email')}:</strong> {info.verificationEmail}</p>
    </div>
    {/* Reset Password Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => moveToResetPassword(info.email)}
          className="px-4 py-2 rounded-lg bg-mediumBlue text-white dark:bg-blue-200 dark:text-blue-950 hover:opacity-90 transition font-semibold cursor-pointer"
        >
          {t('reset_password_button')}
        </button>
      </div>
  </div>
);

}
