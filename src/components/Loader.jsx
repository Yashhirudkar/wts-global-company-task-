import styles from './Loader.module.css';

const Loader = ({ size = 'medium', label = 'Loading...' }) => {
  return (
    <div className={styles.wrapper} role="status" aria-label={label}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.ring} />
        <div className={styles.ring} />
        <div className={styles.ring} />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
};

export default Loader;
