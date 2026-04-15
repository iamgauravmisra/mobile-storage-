import axios from 'axios';

// Add '/api' to your baseURL
const api = axios.create({
  baseURL: import.meta.env.VITE_MONGO_URI || 'http://localhost:5000/api' 
});

export default api;