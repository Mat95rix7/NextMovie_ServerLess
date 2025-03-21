import axios from 'axios';

const API_URL = '/api/auth';

export const authService = {
  async register(email, password) {
    const response = await axios.post(`${API_URL}/register`, {
      email,
      password
    });
    return response.data;
  },

  async login(email, password) {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    return response.data;
  },

  async logout() {
    localStorage.removeItem('token');
  },

  setToken(token) {
    localStorage.setItem('token', token);
  },

  getToken() {
    return localStorage.getItem('token');
  }
};