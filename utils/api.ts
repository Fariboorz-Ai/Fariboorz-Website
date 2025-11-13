import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});
console.log('api', process.env.NEXT_PUBLIC_BACKEND_URL);
export default api;