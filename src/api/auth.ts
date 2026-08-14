import apiClient from './client';

export const authApi = {
  login: async (identifier: string, password: string) => {
    const response = await apiClient.post('/auth/login', { identifier, password });
    return response.data; // { tempToken, isFirstLogin }
  },

  verifyOtp: async (tempToken: string, otp: string) => {
    const response = await apiClient.post('/auth/verify-otp', { tempToken, otp });
    return response.data; // { accessToken }
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data; // User profile
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  }
};
