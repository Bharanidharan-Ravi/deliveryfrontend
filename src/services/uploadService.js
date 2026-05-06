import apiClient from '../core/api/apiClient';

export const uploadService = {
  /**
   * Upload delivery proof image as multipart form
   * Returns { imagePath } — server-side storage path
   */
  uploadProof: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post('/api/upload/proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data; // { imagePath: '...' }
  },
};
