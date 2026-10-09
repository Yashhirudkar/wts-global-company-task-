import { useState, useCallback, useEffect } from 'react';
import { TRAVEL_CLASSES, CITIES, INITIAL_FORM_STATE } from '../constants';
import { validateBookingForm, getTodayString } from '../utils/validation';
import Loader from './Loader';
import SelectDropdown from './SelectDropdown';
import styles from './BookingForm.module.css';

const FormField = ({ label, error, required, children, htmlFor }) => (
  <div className={styles.field}>
    {label && (
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
    )}
    {children}
    {error && (
      <span className={styles.errorMsg} role="alert">
        {error}
      </span>
    )}
  </div>
);

const BookingForm = ({ onSubmit, submitting, editingBooking, onCancelEdit }) => {
  const [formData, setFormData] = useState(
    editingBooking
      ? {
          fullName: editingBooking.fullName ?? '',
          email: editingBooking.email ?? '',
          phone: editingBooking.phone ?? '',
          fromCity: editingBooking.fromCity ?? '',
          toCity: editingBooking.toCity ?? '',
          departureDate: editingBooking.departureDate ?? '',
          travelClass: editingBooking.travelClass ?? 'economy',
          passengers: editingBooking.passengers ?? 1,
        }
      : INITIAL_FORM_STATE
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (editingBooking) {
      setFormData({
        fullName: editingBooking.fullName ?? '',
        email: editingBooking.email ?? '',
        phone: editingBooking.phone ?? '',
        fromCity: editingBooking.fromCity ?? '',
        toCity: editingBooking.toCity ?? '',
        departureDate: editingBooking.departureDate ?? '',
        travelClass: editingBooking.travelClass ?? 'economy',
        passengers: editingBooking.passengers ?? 1,
      });
      setErrors({});
      setTouched({});
    } else {
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      setTouched({});
    }
  }, [editingBooking]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const fieldErrors = validateBookingForm(formData);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const fieldErrors = validateBookingForm(formData);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        setTouched(
          Object.keys(fieldErrors).reduce((acc, k) => ({ ...acc, [k]: true }), {})
        );
        return;
      }
      const result = await onSubmit(formData, editingBooking?.id);
      if (result?.success) {
        setFormData(INITIAL_FORM_STATE);
        setErrors({});
        setTouched({});
      }
    },
    [formData, onSubmit, editingBooking]
  );

  const isEditing = Boolean(editingBooking);

  return (
    <section className={styles.section} id="book">
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          {isEditing ? 'Edit Booking' : 'Book Flight'}
        </h2>
        {isEditing && (
          <button
            type="button"
            className={styles.cancelEditBtn}
            onClick={onCancelEdit}
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
        aria-label="Flight booking form"
      >
        {/* Row 1 */}
        <div className={styles.row}>
          <FormField
            label="Full Name"
            error={touched.fullName && errors.fullName}
            required
            htmlFor="fullName"
          >
            <input
              id="fullName"
              name="fullName"
              type="text"
              className={`${styles.input} ${touched.fullName && errors.fullName ? styles.inputError : ''}`}
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Ravi Kumar"
              autoComplete="name"
            />
          </FormField>

          <FormField
            label="Email Address"
            error={touched.email && errors.email}
            required
            htmlFor="email"
          >
            <input
              id="email"
              name="email"
              type="email"
              className={`${styles.input} ${touched.email && errors.email ? styles.inputError : ''}`}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="ravi@example.com"
              autoComplete="email"
            />
          </FormField>
        </div>

        {/* Row 2 */}
        <div className={styles.row}>
          <FormField
            label="Phone Number"
            error={touched.phone && errors.phone}
            required
            htmlFor="phone"
          >
            <input
              id="phone"
              name="phone"
              type="tel"
              className={`${styles.input} ${touched.phone && errors.phone ? styles.inputError : ''}`}
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="10-digit mobile number"
              autoComplete="tel"
            />
          </FormField>

          <FormField
            label="Number of Passengers"
            error={touched.passengers && errors.passengers}
            required
            htmlFor="passengers"
          >
            <input
              id="passengers"
              name="passengers"
              type="number"
              className={`${styles.input} ${touched.passengers && errors.passengers ? styles.inputError : ''}`}
              value={formData.passengers}
              onChange={handleChange}
              onBlur={handleBlur}
              min={1}
              max={9}
            />
          </FormField>
        </div>

        {/* Row 3 */}
        <div className={styles.row}>
          <FormField
            label="From"
            error={touched.fromCity && errors.fromCity}
            required
            htmlFor="fromCity"
          >
            <SelectDropdown
              id="fromCity"
              name="fromCity"
              className={touched.fromCity && errors.fromCity ? styles.inputError : ''}
              value={formData.fromCity}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Select departure city"
              options={CITIES}
            />
          </FormField>

          <FormField
            label="To"
            error={touched.toCity && errors.toCity}
            required
            htmlFor="toCity"
          >
            <SelectDropdown
              id="toCity"
              name="toCity"
              className={touched.toCity && errors.toCity ? styles.inputError : ''}
              value={formData.toCity}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Select destination city"
              options={CITIES.filter((c) => c !== formData.fromCity)}
            />
          </FormField>
        </div>

        {/* Row 4 */}
        <div className={styles.row}>
          <FormField
            label="Departure Date"
            error={touched.departureDate && errors.departureDate}
            required
            htmlFor="departureDate"
          >
            <input
              id="departureDate"
              name="departureDate"
              type="date"
              className={`${styles.input} ${touched.departureDate && errors.departureDate ? styles.inputError : ''}`}
              value={formData.departureDate}
              onChange={handleChange}
              onBlur={handleBlur}
              min={getTodayString()}
            />
          </FormField>

          <FormField
            label="Travel Class"
            error={touched.travelClass && errors.travelClass}
            required
            htmlFor="travelClass"
          >
            <SelectDropdown
              id="travelClass"
              name="travelClass"
              className={touched.travelClass && errors.travelClass ? styles.inputError : ''}
              value={formData.travelClass}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Select class"
              options={TRAVEL_CLASSES}
            />
          </FormField>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {isEditing && (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onCancelEdit}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? (
              <span className={styles.btnLoader}>
                <Loader size="small" label="" />
                {isEditing ? 'Updating...' : 'Booking...'}
              </span>
            ) : isEditing ? (
              'Update Booking'
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default BookingForm;
