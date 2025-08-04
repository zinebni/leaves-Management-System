import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell({ count, setNbrNotif }) {

  const navigate = useNavigate();

  return (
    <div className="relative inline-block cursor-pointer"
      onClick={() => {
        setNbrNotif(0);
        navigate('Notifications');
      }}
    >
      <Bell className="w-6 h-6 dark:text-zinc-100"/>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-mediumBlue dark:bg-blue-500 text-zinc-100 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );
}
