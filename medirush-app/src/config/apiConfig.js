// Centralized API Configuration for MediRush Frontend

export const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';
export const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';

console.log(`[MediRush Config] Backend API: ${BACKEND_API_URL}`);
console.log(`[MediRush Config] ML Service API: ${ML_API_URL}`);
