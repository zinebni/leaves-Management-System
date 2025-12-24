import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell({ count, setNbrNotif, isShaking }) {
  const navigate = useNavigate();
  const [shake, setShake] = useState(false);

  // Trigger shake animation when isShaking prop changes to true
  useEffect(() => {
    if (isShaking) {
      setShake(true);
      // Remove shake class after animation completes
      const timer = setTimeout(() => setShake(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isShaking]);

  // Also shake when count increases
  useEffect(() => {
    if (count > 0) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <div
      className="relative inline-block cursor-pointer"
      onClick={() => {
        setNbrNotif(0);
        navigate('Notifications');
      }}
    >
      <Bell
        className={`w-6 h-6 dark:text-zinc-100 transition-transform ${
          shake ? 'animate-bell-shake text-amber-500 dark:text-amber-400' : ''
        }`}
      />
      {count > 0 && (
        <span className={`absolute -top-1 -right-1 bg-mediumBlue dark:bg-blue-500 text-zinc-100 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
          shake ? 'animate-pulse' : ''
        }`}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
}
