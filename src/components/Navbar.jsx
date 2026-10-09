import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.logoIcon} aria-hidden="true">✈</span>
          <span className={styles.brandName}>Flight Booking Portal</span>
        </div>
        <div className={styles.nav}>
          <a href="#book" className={styles.navLink}>Book Flight</a>
          <a href="#bookings" className={styles.navLink}>My Bookings</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
