import apiClient from '../core/api/apiClient';

export const authService = {
  /**
   * Login with username + password + deviceId
   * Returns { token, user }
   */
  login: async ({ username, password, deviceId }) => {
    const { data } = await apiClient.post('/api/auth/login', {
      username,
      password,
      deviceId,
    });
    return data; // { token, user: { id, username, role, deviceId } }
  },

  logout: async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch {
      // Silent — clear local state regardless
    }
  },
};
