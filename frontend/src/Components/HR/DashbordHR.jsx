import React from 'react'
import { useTranslation } from 'react-i18next';

export default function DashbordHR() {
  const { t } = useTranslation();
  
  return (
    <div className="p-10 text-gray-900 dark:text-gray-200">
      <h1 className="text-2xl font-bold mb-5">{t('dashboard_title')}</h1>
      <p className='opacity-70'>{t('dashboard_welcome')}</p>
      {/* Add more dashboard-specific content here */}
    </div>
  );
}
