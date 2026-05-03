import { create } from 'zustand';

export const useDeliveryStore = create((set) => ({
  // Step: 0=Login, 1=Dashboard, 2=Scanner, 3=Invoice, 4=Proof, 5=Done
  step: 0,
  setStep: (step) => set({ step }),

  // QR Scan
  scannedQR: null,
  setScannedQR: (qr) => set({ scannedQR: qr }),

  // Invoice data fetched from API
  invoice: null,
  setInvoice: (invoice) => set({ invoice }),

  // Proof image
  proofImageFile: null,
  proofImageUrl: null,
  setProofImage: (file, url) => set({ proofImageFile: file, proofImageUrl: url }),

  // Daily stats
  stats: { open: 0, closed: 0, total: 0 },
  setStats: (stats) => set({ stats }),

  // GPS coordinates
  coordinates: null,
  setCoordinates: (coords) => set({ coordinates: coords }),

  // Uploaded image path (returned by server)
  uploadedImagePath: null,
  setUploadedImagePath: (path) => set({ uploadedImagePath: path }),

  // Loading / error state
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),

  // Reset after delivery posted
  resetSession: () =>
    set({
      step: 1,
      scannedQR: null,
      invoice: null,
      proofImageFile: null,
      proofImageUrl: null,
      coordinates: null,
      uploadedImagePath: null,
      error: null,
    }),
}));
