import axios from 'axios';
const API_BASE_URL = 'http://localhost:8000/api';

export const useAxios = () => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken'); // Retrieve access token from storage
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  api.interceptors.response.use(
    (response) => response, // Return the response if it's successful
    async (error) => {
      const originalRequest = error.config;

      // If a 401 error occurs, attempt to refresh the token
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken'); // Retrieve refresh token from storage

          if (!refreshToken) {
            // No refresh token available, redirect to login or handle appropriately
            window.location.href = '/login';
            return Promise.reject(error);
          }

          // Send request to refresh token
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });

          // Update the access token in local storage
          localStorage.setItem('accessToken', data.accessToken);

          // Update Authorization header and retry the original request
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If refreshing fails, redirect to login or handle appropriately
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error); // If not 401 or token refresh fails, reject the error
    }
  );

  return api;
};
