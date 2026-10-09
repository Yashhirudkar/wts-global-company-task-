import { useState, useCallback, useRef } from 'react';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';
import Notification from '../components/Notification';
import { useBookings } from '../hooks/useBookings';
import styles from './Home.module.css';

const Home = () => {
  const {
    bookings,
    loading,
    submitting,
    error,
    notification,
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
  } = useBookings();

  const [editingBooking, setEditingBooking] = useState(null);
  const formRef = useRef(null);

  const handleEdit = useCallback((booking) => {
    setEditingBooking(booking);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingBooking(null);
  }, []);

  const handleSubmit = useCallback(
    async (formData, bookingId) => {
      const result = bookingId
        ? await updateBooking(bookingId, formData)
        : await createBooking(formData);

      if (result?.success && bookingId) {
        setEditingBooking(null);
      }

      return result;
    },
    [createBooking, updateBooking]
  );

  return (
    <main className={styles.main}>
      <Notification notification={notification} />

      <div className={styles.container}>
        <div ref={formRef} className={styles.scrollAnchor} id="book">
          <BookingForm
            onSubmit={handleSubmit}
            submitting={submitting}
            editingBooking={editingBooking}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        <div id="bookings">
          <BookingList
            bookings={bookings}
            loading={loading}
            error={error}
            onDelete={deleteBooking}
            onEdit={handleEdit}
            onRetry={fetchBookings}
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
