import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

// Set auth token header
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Expense API calls
export const getExpenses = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  const res = await axios.get(`${API_URL}/expenses?${params.toString()}`);
  return res.data;
};

export const addExpense = async (expenseData) => {
  const res = await axios.post(`${API_URL}/expense`, expenseData);
  return res.data;
};

export const deleteExpense = async (id) => {
  const res = await axios.delete(`${API_URL}/expense/${id}`);
  return res.data;
};
