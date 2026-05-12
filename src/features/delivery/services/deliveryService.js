import apiClient from "../../../core/api/apiClient";

export const deliveryService = {
  /**
   * Get today's delivery stats for the logged-in user
   * Returns { open, closed, total }
   */
  getDailyStats: async () => {
    const { data } = await apiClient.get('/api/deliveries/stats/daily', { 
      silent: true 
    });
    return data;
  },

  getDocument: async ({ docNum, docType }) => {
    const { data } = await apiClient.get(
      `/api/deliveries/document?docNum=${docNum}&docType=${docType}`,
    );
    return data;
  },
  /**
   * Post a completed delivery record
   */
  postDelivery: async (payload) => {
    console.log("its trigger :", payload);

    const { data } = await apiClient.post("/api/deliveries", {
      ...payload,
      timestamp: new Date().toISOString(),
    });
    return data;
  },

  getHistory: async () => {
    const { data } = await apiClient.get("/api/deliveries/history", { 
      silent: true 
    });
    return data;
  },
};
