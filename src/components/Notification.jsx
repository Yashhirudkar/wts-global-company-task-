import { useEffect, useRef } from 'react';
import styles from './Notification.module.css';

const Notification = ({ notification }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  if (!notification) return null;

  const { message, type } = notification;

  return (
    <div
      className={`${styles.notification} ${styles[type]}`}
      role="alert"
      aria-live="polite"
    >
      <span className={styles.icon} aria-hidden="true">
        {type === 'success' ? '✓' : '✕'}
      </span>
      <span className={styles.message}>{message}</span>
    </div>
  );
};

export default Notification;
