import apiClient from "../../../core/api/apiClient";

export const deliveryService = {
  /**
   * Get today's delivery stats for the logged-in user
   * Returns { open, closed, total }
   */
 getDailyStats: async () => {
    const { data } = await apiClient.get('/api/deliveries/stats/daily');
    return data;
  },
  
  getDocument: async ({docNum, docType}) => {
    const { data } = await apiClient.get(`/api/deliveries/document?docNum=${docNum}&docType=${docType}`);
    return data;
  },
  /**
   * Post a completed delivery record
   */
  postDelivery: async ({ invoiceNumber, latitude, longitude, deviceId, imagePath }) => {
    const { data } = await apiClient.post('/api/deliveries', {
      invoiceNumber,
      latitude,
      longitude,
      deviceId,
      imagePath,
      timestamp: new Date().toISOString(),
    });
    return data;
  },
};
