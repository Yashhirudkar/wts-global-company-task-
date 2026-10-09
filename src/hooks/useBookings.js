import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (err) {
      const message =
        err.code === 'ECONNABORTED'
          ? 'Request timed out. Please check your connection.'
          : err.response?.data?.message ?? 'Failed to load bookings. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(
    async (formData) => {
      setSubmitting(true);
      try {
        const newBooking = await bookingService.create(formData);
        setBookings((prev) => [newBooking, ...prev]);
        showNotification('Booking confirmed! Your flight has been reserved successfully.', 'success');
        return { success: true };
      } catch (err) {
        const message =
          err.response?.data?.message ?? 'Booking failed. Please try again.';
        showNotification(message, 'error');
        return { success: false, error: message };
      } finally {
        setSubmitting(false);
      }
    },
    [showNotification]
  );

  const updateBooking = useCallback(
    async (id, formData) => {
      setSubmitting(true);
      try {
        const updated = await bookingService.update(id, formData);
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? updated : b))
        );
        showNotification('Booking updated successfully!', 'success');
        return { success: true };
      } catch (err) {
        const message =
          err.response?.data?.message ?? 'Update failed. Please try again.';
        showNotification(message, 'error');
        return { success: false, error: message };
      } finally {
        setSubmitting(false);
      }
    },
    [showNotification]
  );

  const deleteBooking = useCallback(
    async (id) => {
      try {
        await bookingService.remove(id);
        setBookings((prev) => prev.filter((b) => b.id !== id));
        showNotification('Booking cancelled successfully.', 'success');
      } catch (err) {
        const message =
          err.response?.data?.message ?? 'Delete failed. Please try again.';
        showNotification(message, 'error');
      }
    },
    [showNotification]
  );

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    submitting,
    error,
    notification,
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
  };
};
