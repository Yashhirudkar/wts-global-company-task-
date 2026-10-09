import { useState } from 'react';
import Loader from './Loader';
import styles from './BookingList.module.css';

const CLASS_LABELS = {
  economy: 'Economy',
  business: 'Business',
  first: 'First Class',
};

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', cls: 'confirmed' },
  pending: { label: 'Pending', cls: 'pending' },
  cancelled: { label: 'Cancelled', cls: 'cancelled' },
};

const BookingRow = ({ booking, onEdit, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Cancel booking for ${booking.fullName}?`)) return;
    setDeleting(true);
    await onDelete(booking.id);
    setDeleting(false);
  };

  const formattedDate = booking.departureDate
    ? new Date(booking.departureDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

  const statusCfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;

  return (
    <tr className={styles.row}>
      <td className={styles.td}>
        <div className={styles.nameCell}>
          <span className={styles.name}>{booking.fullName}</span>
          <span className={styles.email}>{booking.email}</span>
        </div>
      </td>
      <td className={styles.td}>
        <span className={styles.route}>
          {booking.fromCity} → {booking.toCity}
        </span>
      </td>
      <td className={styles.td}>{formattedDate}</td>
      <td className={styles.td}>
        {CLASS_LABELS[booking.travelClass] ?? booking.travelClass}
      </td>
      <td className={styles.td}>
        <span className={`${styles.statusText} ${styles[statusCfg.cls]}`}>
          {statusCfg.label}
        </span>
      </td>
      <td className={`${styles.td} ${styles.actionsTd}`}>
        <button
          className={styles.editBtn}
          onClick={() => onEdit(booking)}
          type="button"
          aria-label={`Edit booking for ${booking.fullName}`}
        >
          Edit
        </button>
        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
          disabled={deleting}
          type="button"
          aria-label={`Cancel booking for ${booking.fullName}`}
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </td>
    </tr>
  );
};

const EmptyState = () => (
  <tr>
    <td colSpan={6} className={styles.emptyTd}>
      <div className={styles.empty}>
        <span className={styles.emptyIcon} aria-hidden="true">✈</span>
        <p className={styles.emptyTitle}>No bookings found</p>
        <p className={styles.emptyText}>Your confirmed flights will appear here.</p>
      </div>
    </td>
  </tr>
);

const BookingList = ({ bookings, loading, error, onDelete, onEdit, onRetry }) => {
  return (
    <section className={styles.section} id="bookings">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>My Bookings</h2>
        {bookings.length > 0 && (
          <span className={styles.count}>{bookings.length} record{bookings.length > 1 ? 's' : ''}</span>
        )}
      </div>

      {error ? (
        <div className={styles.errorBlock} role="alert">
          <span>{error}</span>
          {onRetry && (
            <button className={styles.retryBtn} onClick={onRetry} type="button">
              Retry
            </button>
          )}
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table} aria-label="Bookings table">
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Passenger</th>
                <th className={styles.th}>Route</th>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Class</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className={styles.emptyTd}>
                    <Loader size="medium" label="Loading bookings…" />
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <EmptyState />
              ) : (
                bookings.map((booking) => (
                  <BookingRow
                    key={booking.id}
                    booking={booking}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default BookingList;
