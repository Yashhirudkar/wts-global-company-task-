import { useState } from 'react';
import Loader from './Loader';
import styles from './BookingList.module.css';

const CLASS_LABELS = {
  economy: 'Economy',
  business: 'Business',
  first: 'First Class',
  'first class': 'First Class',
};

const STATUS_CONFIG = {
  confirmed: 'confirmed',
  pending: 'pending',
  cancelled: 'cancelled',
};

/* ── Shared data prep helper ── */
const useBookingData = (booking) => {
  const rawDate = booking.departureDate;
  const formattedDate = rawDate
    ? new Date(`${rawDate}`.length === 10 ? `${rawDate}T12:00:00` : rawDate)
        .toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
    : '—';

  const fromCity = booking.fromCity ?? booking.from ?? '—';
  const toCity   = booking.toCity   ?? booking.to   ?? '—';

  const travelClass = String(booking.travelClass ?? '—').toLowerCase();
  const classLabel  = CLASS_LABELS[travelClass] ?? booking.travelClass ?? '—';

  const status      = String(booking.status ?? 'pending').toLowerCase();
  const statusClass = STATUS_CONFIG[status] ?? 'pending';
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

  return { formattedDate, fromCity, toCity, classLabel, statusClass, statusLabel };
};

/* ══════════════════════════════════════════════════════
   Desktop table row
══════════════════════════════════════════════════════ */
const BookingTableRow = ({ booking, onEdit, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const { formattedDate, fromCity, toCity, classLabel, statusClass, statusLabel } =
    useBookingData(booking);

  const handleDelete = async () => {
    if (!window.confirm(`Delete booking for ${booking.fullName || 'this passenger'}?`)) return;
    setDeleting(true);
    try { await onDelete(booking.id); } finally { setDeleting(false); }
  };

  return (
    <tr className={styles.row}>
      <td className={styles.td}>
        <div className={styles.nameCell}>
          <span className={styles.name}>{booking.fullName || '—'}</span>
          <span className={styles.email}>{booking.email || '—'}</span>
        </div>
      </td>
      <td className={styles.td}>
        <span className={styles.route}>{fromCity} → {toCity}</span>
      </td>
      <td className={styles.td}>{formattedDate}</td>
      <td className={styles.td}>{classLabel}</td>
      <td className={styles.td}>
        <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
          {statusLabel}
        </span>
      </td>
      <td className={`${styles.td} ${styles.actionsTd}`}>
        <div className={styles.actions}>
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
            aria-label={`Delete booking for ${booking.fullName}`}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </td>
    </tr>
  );
};

/* ══════════════════════════════════════════════════════
   Mobile card
══════════════════════════════════════════════════════ */
const BookingCard = ({ booking, onEdit, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const { formattedDate, fromCity, toCity, classLabel, statusClass, statusLabel } =
    useBookingData(booking);

  const handleDelete = async () => {
    if (!window.confirm(`Delete booking for ${booking.fullName || 'this passenger'}?`)) return;
    setDeleting(true);
    try { await onDelete(booking.id); } finally { setDeleting(false); }
  };

  return (
    <div className={styles.card}>
      {/* Passenger header */}
      <div className={styles.cardHeader}>
        <div className={styles.cardName}>{booking.fullName || '—'}</div>
        <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
          {statusLabel}
        </span>
      </div>
      <div className={styles.cardEmail}>{booking.email || '—'}</div>

      {/* Details grid */}
      <div className={styles.cardDetails}>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Route</span>
          <span className={styles.cardValue}>{fromCity} → {toCity}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Date</span>
          <span className={styles.cardValue}>{formattedDate}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Class</span>
          <span className={styles.cardValue}>{classLabel}</span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.cardActions}>
        <button
          className={styles.editBtn}
          onClick={() => onEdit(booking)}
          type="button"
        >
          Edit
        </button>
        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
          disabled={deleting}
          type="button"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   Main BookingList
══════════════════════════════════════════════════════ */
const BookingList = ({
  bookings = [],
  loading,
  error,
  onDelete,
  onEdit,
  onRetry,
}) => {
  const isEmpty = bookings.length === 0;

  const bodyContent = error ? (
    <div className={styles.errorBlock} role="alert">
      <span>{error}</span>
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry} type="button">
          Retry
        </button>
      )}
    </div>
  ) : loading ? (
    <div className={styles.loadingState}>
      <Loader size="medium" label="Loading bookings…" />
    </div>
  ) : isEmpty ? (
    <div className={styles.empty}>
      <span className={styles.emptyIcon} aria-hidden="true">✈</span>
      <p className={styles.emptyTitle}>No bookings found</p>
      <p className={styles.emptyText}>Your bookings will appear here.</p>
    </div>
  ) : null;

  return (
    <section className={styles.section} id="bookings">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>My Bookings</h2>
        {bookings.length > 0 && (
          <span className={styles.count}>
            {bookings.length} record{bookings.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {bodyContent}

      {!error && !loading && !isEmpty && (
        <>
          {/* ── Desktop table ── */}
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
                {bookings.map((booking) => (
                  <BookingTableRow
                    key={booking.id}
                    booking={booking}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ── */}
          <div className={styles.cardList} aria-label="Bookings list">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default BookingList;
