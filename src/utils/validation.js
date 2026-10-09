export const validateBookingForm = (formData) => {
  const errors = {};

  if (!formData.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = 'Name must be at least 2 characters';
  }

  if (!formData.email?.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
    errors.phone = 'Phone number must contain exactly 10 digits';
  }

  if (!formData.fromCity) {
    errors.fromCity = 'Departure city is required';
  }

  if (!formData.toCity) {
    errors.toCity = 'Destination city is required';
  } else if (formData.toCity === formData.fromCity) {
    errors.toCity = 'Destination must differ from departure city';
  }

  if (!formData.departureDate) {
    errors.departureDate = 'Departure date is required';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.departureDate);
    if (selectedDate < today) {
      errors.departureDate = 'Departure date cannot be in the past';
    }
  }

  if (!formData.travelClass) {
    errors.travelClass = 'Please select a travel class';
  }

  if (!formData.passengers || Number(formData.passengers) < 1) {
    errors.passengers = 'At least 1 passenger is required';
  } else if (Number(formData.passengers) > 9) {
    errors.passengers = 'Maximum 9 passengers allowed';
  }


  return errors;
};

export const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};
