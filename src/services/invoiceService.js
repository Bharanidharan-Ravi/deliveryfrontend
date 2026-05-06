import apiClient from '../core/api/apiClient';

export const invoiceService = {
  /**
   * Fetch invoice details by QR code value
   * Returns { orderNumber, quantity, totalPrice, customerBalance }
   */
  fetchInvoice: async (qrCode) => {
    const { data } = await apiClient.get(`/api/invoices/${encodeURIComponent(qrCode)}`);
    return data;
  },
};
