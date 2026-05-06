import axios from 'axios';
import { config } from '../../config/appConfig';
import { useAuthStore } from '../../store/useAuthStore';

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
apiClient.interceptors.request.use((req) => {
  const token = useAuthStore.getState().token;
  if (token) req.headers.Authorization = `Bearer ${token}`;

  // Attach device fingerprint header
  const deviceId = localStorage.getItem('deviceId');
  if (deviceId) req.headers['X-Device-Id'] = deviceId;

  return req;
});

// On 401 → logout and redirect to login
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
