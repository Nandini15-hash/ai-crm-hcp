import axios from "axios";

// In production (Vercel), set VITE_API_URL to the deployed backend's URL.
// Falls back to the local FastAPI dev server for local development.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

export default api;
