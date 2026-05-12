import apiClient from "../../../core/api/apiClient";

export const uploadService = {
  uploadProof: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post('/api/upload/proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data; 
  },

  uploadProofToTemp: async (file, documentNumber) => {
    const formData = new FormData();
    formData.append("File", file); 
    formData.append("DocumentNumber", documentNumber); 

    const { data } = await apiClient.post('/api/upload/uploadTemp', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data; 
  },

  // 🚀 NEW: Delete file from temp storage
  deleteTempProof: async (documentNumber, fileName) => {
    const { data } = await apiClient.delete(`/api/upload/uploadTemp/${documentNumber}/${fileName}`);
    return data;
  }
};