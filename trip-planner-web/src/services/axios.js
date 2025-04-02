import axios from "axios";
export const useAxios = () => {
  const API_BASE_URL = "http://localhost:8000/api";
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          console.warn("No refresh token found. Logging out.");
          localStorage.clear();
          window.location.href = "/login"; // Redirect to login page
          return Promise.reject(error);
        }

        try {
          const { data } = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken });

          localStorage.setItem("accessToken", data.access);
          originalRequest.headers["Authorization"] = `Bearer ${data.access}`;

          return api(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token expired. Logging out.");
          localStorage.clear();
          window.location.href = "/login"; // Force logout
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

