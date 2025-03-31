import { useAxios } from './axios';

export default function useTripService() {
  const api = useAxios();

  // Helper function for making API requests
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

  // Function to create a trip
  async function createTrip(userData) {
    return request('/trips/', userData); // Use the request function with the correct endpoint
  }

  // Generic function to make API calls
  async function genericApiCall(endpoint, data, method) {
    return request(endpoint, data, method);
  }

  return {
    request,
    createTrip,
    genericApiCall,
  };
}
