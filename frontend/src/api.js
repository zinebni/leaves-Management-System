// src/api.js
// Centralized axios instance with base URL configuration
import axios from 'axios';

// Use environment variable or fallback:
// - In development: http://localhost:4000
// - In production (Docker): empty string (uses relative URLs via nginx proxy)
const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;

