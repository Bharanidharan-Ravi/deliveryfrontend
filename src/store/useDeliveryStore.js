// import { create } from 'zustand';

// export const useDeliveryStore = create((set) => ({
//   // Delivery workflow only
//   step: 'scan',

//   setStep: (step) => set({ step }),

//   // QR Scan
//   scannedQR: null,
//   setScannedQR: (qr) => set({ scannedQR: qr }),

//   // Invoice
//   invoice: null,
//   setInvoice: (invoice) => set({ invoice }),

//   // Proof image
//   proofImageFile: null,
//   proofImageUrl: null,

//   setProofImage: (file, url) =>
//     set({
//       proofImageFile: file,
//       proofImageUrl: url,
//     }),

//   // Stats
//   stats: {
//     open: 0,
//     closed: 0,
//     total: 0,
//   },

//   setStats: (stats) => set({ stats }),

//   // GPS
//   coordinates: null,
//   setCoordinates: (coords) => set({ coordinates: coords }),

//   // Uploaded image path
//   uploadedImagePath: null,
//   setUploadedImagePath: (path) =>
//     set({ uploadedImagePath: path }),

//   // UI state
//   loading: false,
//   setLoading: (loading) => set({ loading }),

//   error: null,
//   setError: (error) => set({ error }),

//   // Reset workflow
//   resetSession: () =>
//     set({
//       step: 'scan',
//       scannedQR: null,
//       invoice: null,
//       proofImageFile: null,
//       proofImageUrl: null,
//       coordinates: null,
//       uploadedImagePath: null,
//       error: null,
//     }),
// }));