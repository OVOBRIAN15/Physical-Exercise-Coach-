
import React, { useEffect, useState } from 'react';
import { InfoCircleIcon } from './Icons';

interface NotificationToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, onClose, duration = 8000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in
    setVisible(true);

    // Set timer to fade out and close
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
    // Allow time for fade-out animation before calling onClose
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      } w-full max-w-sm bg-white dark:bg-light-bg border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 flex items-start space-x-3`}
    >
      <div className="flex-shrink-0">
        <InfoCircleIcon className="w-6 h-6 text-primary-light dark:text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-light-text">System Notification</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-text">{message}</p>
      </div>
      <div className="flex-shrink-0">
        <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-white">&times;</button>
      </div>
    </div>
  );
};

export default NotificationToast;