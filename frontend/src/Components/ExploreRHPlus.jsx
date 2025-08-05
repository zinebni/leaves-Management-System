import React from 'react';
import {
  Building2, Users, UserPlus,
  ClipboardCheck, CalendarDays, History, CalendarSearch
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import WebSiteName from './WebSiteName';
import LanguageSwitcher from '../i18n/LanguageSwitcher';

export default function ExploreRHPlus() {
  const { t } = useTranslation();

  const sections = [
    {
      title: t('explore.org.title'),
      icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 group-hover:text-politeBlue" />,
      items: [
        {
          title: t('explore.org.departments.title'),
          desc: t('explore.org.departments.desc'),
        },
        {
          title: t('explore.org.hr.title'),
          desc: t('explore.org.hr.desc'),
        },
      ],
    },
    {
      title: t('explore.hr.title'),
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 group-hover:text-politeBlue" />,
      items: [
        {
          title: t('explore.hr.employees.title'),
          desc: t('explore.hr.employees.desc'),
        },
        {
          title: t('explore.hr.requests.title'),
          desc: t('explore.hr.requests.desc'),
        },
        {
          title: t('explore.hr.history.title'),
          desc: t('explore.hr.history.desc'),
        },
        {
          title: t('explore.hr.events.title'),
          desc: t('explore.hr.events.desc'),
        },
      ],
    },
    {
      title: t('explore.emp.title'),
      icon: <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 group-hover:text-politeBlue" />,
      items: [
        {
          title: t('explore.emp.request.title'),
          desc: t('explore.emp.request.desc'),
        },
        {
          title: t('explore.emp.history.title'),
          desc: t('explore.emp.history.desc'),
        },
        {
          title: t('explore.emp.inform.title'),
          desc: t('explore.emp.inform.desc'),
        },
      ],
    },
  ];

  return (
    <div
      className="w-full relative overflow-x-hidden mb-5 min-h-[100vh]"
    >
      <div className="px-5 sm:px-10 py-5 flex justify-between items-center">
        <WebSiteName />
        <LanguageSwitcher />
      </div>
      <div className="max-w-7xl mx-auto px-6 py-5 sm:py-0">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-600 mb-4" data-aos='fade-right'>
            🌟 {t('explore.title')}
          </h1>
          <p className="text-[17px] sm:text-lg text-gray-600" data-aos='fade-right' data-aos-delay='200'>
            {t('explore.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-aos="zoom-in" data-aos-delay='400'>
          {sections.map((section, idx) => (
            <div key={idx} className="group bg-white border-2 border-blue-500  rounded-xl px-6 py-5 sm:p-8 shadow-lg hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-blue-700 hover:to-blue-50 hover:border-blue-600 transition-all duration-500 cursor-pointer">
              <div className="flex items-center mb-3 gap-3 ">
                {section.icon}
                <h2 className="text-lg sm:text-xl font-semibold text-blue-600 group-hover:text-politeBlue">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-3 pb-4">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <p className="text-[15px] sm:text-base text-gray-800 font-medium group-hover:text-gray-900">{item.title}</p>
                    <p className="text-[13px] sm:text-sm text-gray-500 group-hover:text-gray-800">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
