import axios from 'axios';

const api = axios.create({
  // Ensure this matches the PORT in your backend index.js (usually 5000)
  baseURL: 'http://localhost:5000/api', 
});

export default api;