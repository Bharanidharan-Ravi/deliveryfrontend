import axios from 'axios';
import { config } from '../../config/appConfig';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// 🚀 Request Interceptor
apiClient.interceptors.request.use((req) => {
  // 1. Only turn on the global spinner if the request is NOT silent
  if (!req.silent) {
    useUIStore.getState().startRequest();
  }

  // 2. Attach tokens and headers
  const token = useAuthStore.getState().token;
  if (token) req.headers.Authorization = `Bearer ${token}`;

  const deviceId = localStorage.getItem('deviceId');
  if (deviceId) req.headers['X-Device-Id'] = deviceId;

  return req;
});

// 🚀 Response Interceptor
apiClient.interceptors.response.use(
  (res) => {
    // 1. Only turn off the spinner if it wasn't a silent request
    if (!res.config.silent) {
      useUIStore.getState().endRequest();
    }
    return res;
  },
  (error) => {
    // 2. Turn off the loading spinner on failure (safely check config)
    if (!error.config?.silent) {
      useUIStore.getState().endRequest();
    }

    // 3. Handle 401 Unauthorized
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.reload();
      return Promise.reject(error);
    }

    // 4. Extract exact error message from C# backend
    let errorMsg = "An unexpected error occurred.";
    if (error.response?.data?.errors) {
      const firstErrorKey = Object.keys(error.response.data.errors)[0];
      errorMsg = error.response.data.errors[firstErrorKey][0]; 
    } else if (error.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error.response?.data?.title) {
      errorMsg = error.response.data.title;
    } else if (error.message) {
      errorMsg = error.message;
    }

    // 5. Trigger the Global Error Banner!
    useUIStore.getState().setError(errorMsg);

    return Promise.reject(error);
  }
);

export default apiClient;