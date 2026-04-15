import axios from 'axios';

// IMPORTANT: Use the VITE_ prefix if you are using Vite, 
// or REACT_APP_ if using Create React App.
const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: baseURL,
});

export default api;