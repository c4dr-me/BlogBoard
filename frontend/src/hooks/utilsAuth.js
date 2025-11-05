import {jwtDecode} from 'jwt-decode';

export const AUTH_STORAGE_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY

export const getStoredAuth = () => {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    return authData ? JSON.parse(authData) : null;
  } catch (error) {
    console.error('Error reading auth data:', error);
    return null;
  }
};

export const setStoredAuth = (authData) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Error storing auth data:', error);
  }
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const isValidToken = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

export const getUserIdFromToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.sub; 
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};