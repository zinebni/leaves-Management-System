import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import api from '../../api';

export default function NotificationPage() {
  const [notifs, setNotifs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/api/notification/getNotifications');
      const notifications = res.data.notifications || [];
      setNotifs(notifications);
      console.log(notifications);
      notifications.map(async (notif) => {
        try{
          const res = await api.put(`/api/notification/markNotificationAsRead/${notif._id}`, {});
          console.log(res);
        } catch(error){
          console.log(error);
        }
      })
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const extractTypeAndStatusFromMessage = (message) => {
    const approvedRegex = /congé ([\w\s()]+) a été approuvée/;
    const rejectedRegex = /congé ([\w\s()]+) a été refusée/;

    let match = message.match(approvedRegex);
    if (match) return { type: match[1].trim(), status: 'approved' };

    match = message.match(rejectedRegex);
    if (match) return { type: match[1].trim(), status: 'rejected' };

    return { type: null, status: null };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-lg italic mt-10 gap-2">
        <div className="w-5 h-5 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
        {t('loading')}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-mediumBlue dark:text-politeBlue mb-6 flex items-center gap-2">
        <Bell className="w-5 h-5" strokeWidth={3}/> {t('notification.new_notification')}
      </h2>

      {notifs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300 italic text-center text-lg">{t('notification.no_notifications')}</p>
      ) : (
        <ul className="space-y-4">
          {notifs.map((notif) => {
            const { type, status } = extractTypeAndStatusFromMessage(notif.message);
            const formattedDate = new Date(notif.createdAt).toLocaleString();
            const translatedMsg =
              type && status
                ? <Trans
                  i18nKey={`notification.leave_${status}`}
                  values={{ type: t(type) }}
                  components={{ strong: <strong className="font-semibold" /> }}
                />
                : notif.message;

            return (
              <li
                key={notif._id}
                className="bg-white dark:bg-blue-950/60 shadow-sm rounded-xl p-4 border border-gray-200 dark:border-blue-950 flex justify-between items-start"
              >
                <div>
                  <p className="text-gray-800 dark:text-gray-100">{translatedMsg}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
