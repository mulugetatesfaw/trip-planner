import { useAxios } from "./axios";
export default function useAuthService() {
  const api = useAxios();

  async function request(endpoint, data, method = 'post') {
    try {
      const response = await api.request({
        url: endpoint,
        method,
        data,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
  async function register(userData) {
    return this.request('/auth/register/', userData);
  }
  async function login(credentials) {
    return this.request('/auth/login/', credentials);
  }

  return {
    request,
    register,
    login,
  };

}