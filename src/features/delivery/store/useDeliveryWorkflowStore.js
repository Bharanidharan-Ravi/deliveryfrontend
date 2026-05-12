import { create } from "zustand";

export const useDeliveryWorkflowStore = create((set) => ({
  step: 1,

  documentType: "Invoice",

  scannedValue: "",

  invoiceData: null,

  comment: "",

  // loading: false,

    // QR Scan
  scannedQR: null,
  setScannedQR: (qr) => set({ scannedQR: qr }),
  
  error: null,
  // Stats
  stats: {
    open: 0,
    closed: 0,
    total: 0,
  },
  setStep: (step) => set({ step }),

  setDocumentType: (documentType) =>
    set({ documentType }),

  setScannedValue: (scannedValue) =>
    set({ scannedValue }),

  setInvoiceData: (invoiceData) =>
    set({ invoiceData }),

  setComment: (comment) =>
    set({ comment }),

  // setLoading: (loading) =>
  //   set({ loading }),

  setError: (error) =>
    set({ error }),

  resetSession: () =>
    set({
      step: 1,
      scannedValue: "",
      invoiceData: null,
      comment: "",
      // loading: false,
      error: null,
    }),
}));