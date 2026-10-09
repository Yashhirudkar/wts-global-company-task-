export const API_BASE_URL = 'https://6ac8fb03fd7c536b1bda4ab7.mockapi.io/bookings';

export const TRAVEL_CLASSES = [
  { value: 'economy', label: 'Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First Class' },
];

export const CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Nagpur',
  'Surat',
  'Kochi',
  'Goa',
  'Bhubaneswar',
  'Dubai',
  'Singapore',
  'London',
  'New York',
  'Bangkok',
];

export const STATUS_COLORS = {
  confirmed: '#10b981',
  pending: '#f59e0b',
  cancelled: '#ef4444',
};

export const INITIAL_FORM_STATE = {
  fullName: '',
  email: '',
  phone: '',
  fromCity: '',
  toCity: '',
  departureDate: '',
  travelClass: 'economy',
  passengers: 1,
};
