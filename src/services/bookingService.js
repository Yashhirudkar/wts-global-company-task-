import axios from 'axios';
import { API_BASE_URL } from '../constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const bookingService = {
  getAll: async () => {
    const { data } = await apiClient.get('/');
    return data;
  },

  create: async (bookingData) => {
    const payload = {
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    const { data } = await apiClient.post('/', payload);
    return data;
  },

  update: async (id, bookingData) => {
    const { data } = await apiClient.put(`/${id}`, bookingData);
    return data;
  },

  remove: async (id) => {
    const { data } = await apiClient.delete(`/${id}`);
    return data;
  },
};
