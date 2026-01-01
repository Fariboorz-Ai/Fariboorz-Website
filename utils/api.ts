import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'User-Agent': 'Fariboorz-Trading-Bot/1.0',
  },
});
export default api;