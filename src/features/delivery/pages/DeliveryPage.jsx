import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; 
import { useAuthStore } from "../../../store/useAuthStore";
import { useDeliveryWorkflowStore } from "../store/useDeliveryWorkflowStore";
import { uploadService } from "../../../services/uploadService";
import { useGeolocation } from "../../../hooks/useGeolocation";
import { useDeviceInfo } from "../../../hooks/useDeviceInfo";
import { QRScanner } from "../scanner/QRScanner";
import ManualEntryForm from "../manualentry/ManualEntryForm";
import { CameraCapture } from "../proof/CameraCapture";
import { ImageValidator } from "../proof/ImageValidator";
import { Spinner } from "../../../components/common/Spinner";
import { ErrorBanner } from "../../../components/common/ErrorBanner";
import InvoiceDetailsCard from "../invoice/InvoiceDetailsCard";
import { useDailyStatsQuery, usePostDelivery } from "../hooks/useDelivery";
import { deliveryService } from "../services/deliveryService";
import { useUIStore } from "../../../store/useUIStore";
import { useTranslation } from "react-i18next";

export default function DeliveryPage() {
  const { isAuthenticated } = useAuthStore();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const { globalError, clearError, setError } = useUIStore();
  const { t } = useTranslation();
  const { mutateAsync: submitDelivery } = usePostDelivery();

  const {
    step,
    setStep,
    scannedQR,
    setScannedQR,
    invoiceData,
    setInvoiceData,
    stats,
    setCoordinates,
    setUploadedImagePath,
    resetSession,
  } = useDeliveryWorkflowStore();

  const { capture: captureGPS } = useGeolocation();
  const { getInfo } = useDeviceInfo();
  const { data: queryStats } = useDailyStatsQuery();
  const displayStats = queryStats || stats;

  // ==========================================
  // ROUTING LOGIC
  // ==========================================
  const [searchParams, setSearchParams] = useSearchParams();

  const navigateToStep = (newStep, specificDoc = null) => {
    const targetDoc = specificDoc || scannedQR;
    const params = new URLSearchParams();
    params.set("step", newStep);
    if (newStep >= 3 && targetDoc) params.set("doc", targetDoc);
    setSearchParams(params);
    setStep(newStep);
  };

  useEffect(() => {
    const urlStep = parseInt(searchParams.get("step")) || 1;
    const urlDoc = searchParams.get("doc") || "";

    if (urlStep >= 3 && !urlDoc) return navigateToStep(1);

    if (urlStep >= 3 && urlDoc && !invoiceData) {
      const parts = urlDoc.split("-");
      if (parts.length >= 2) {
        setScannedQR(urlDoc);
        verifyDocument(parts[0].trim(), parseInt(parts[1].trim(), 10), urlStep); 
      } else {
        navigateToStep(1); 
      }
      return;
    }

    if (step !== urlStep && invoiceData) setStep(urlStep);
  }, [searchParams.get("step"), searchParams.get("doc")]);

  // ==========================================
  // API GATEKEEPER
  // ==========================================
  const verifyDocument = async (docNum, docType, targetStep = 3, isManual = false) => {
    try {
      clearError();
      const data = await deliveryService.getDocument({ docNum, docType });
      if (data) {
        setInvoiceData(data);
        const combinedDocString = `${docNum}-${docType}`;
        setScannedQR(combinedDocString);
        navigateToStep(targetStep, combinedDocString); 
      }
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.message || "";
      if (backendMessage.includes("already been posted")) {
        setError(t("errors.alreadyPosted", { docNum: docNum }));
      } else if (backendMessage.includes("Document not found")) {
        setError(t("errors.invalidBarcode")); 
      } else {
        setError(t("errors.documentRejected")); 
      }
      if (!isManual) navigateToStep(1); 
    }
  };

  const handleScanSuccess = (scannedText) => {
    const parts = scannedText.split("-");
    if (parts.length >= 2) {
      verifyDocument(parts[0].trim(), parseInt(parts[1].trim(), 10), 3, false);
    } else {
      setError(t("errors.invalidBarcode"));
    }
  };

  const handleManualSubmit = (docNum, docType) => {
    verifyDocument(docNum, docType, 3, true);
  };

  const handleConfirmDelivery = async (details) => {
    try {
      let coords = null;
      try { coords = await captureGPS(); } catch (e) { console.warn(e); }

      const imageFileNames = details.images.map((img) => img.fileName || img.FileName);
      const deviceInfo = getInfo();

      await submitDelivery({
        DocumentNo: String(invoiceData?.docNum),
        DocumentType: String(invoiceData?.docType),
        Latitude: coords?.latitude || null,
        Longitude: coords?.longitude || null,
        DeviceId: deviceInfo?.deviceId || "UNKNOWN",
        Images: imageFileNames,
        Vehicle: details.vehicle || "",
        Remarks: details.remarks || "",
      });

      localStorage.removeItem(`temp_images_${invoiceData?.docNum}`);
      navigateToStep(4);
    } catch (err) {
      console.error("Delivery Post Failed:", err);
    }
  };

  const Progress = () => (
    <div className="flex gap-2 mb-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <div
          key={s}
          className={`h-1.5 flex-1 rounded-full transition-all duration-500 ease-out ${
            s <= step ? "bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "bg-foreground/10"
          }`}
        />
      ))}
    </div>
  );

  // ==========================================
  // STEP 1 → Scanner
  // ==========================================
  if (step === 1) {
    return (
      <div className="flex flex-col h-full flex-1 relative animate-fade-in">
        <div className="shrink-0 space-y-3 mb-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-foreground leading-tight">
              {t("scanner.title")}
            </h2>
            <p className="text-[12px] font-medium text-muted mt-0.5">{t("scanner.subtitle")}</p>
          </div>
          
          <Progress />
          
          <div className="pt-1">
            <p className="text-[10px] text-muted uppercase tracking-widest mb-2 font-bold">
              {t("summary.title")}
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 py-2.5 text-center shadow-sm">
                <div className="text-xl font-black text-amber-600 dark:text-amber-400">
                  {displayStats?.open}
                </div>
                <div className="text-[10px] font-semibold text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                  {t("summary.open")}
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 py-2.5 text-center shadow-sm">
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {displayStats?.closed}
                </div>
                <div className="text-[10px] font-semibold text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
                  {t("summary.closed")}
                </div>
              </div>
              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 py-2.5 text-center shadow-sm">
                <div className="text-xl font-black text-sky-600 dark:text-sky-400">
                  {displayStats?.total}
                </div>
                <div className="text-[10px] font-semibold text-sky-700/80 dark:text-sky-400/80 mt-0.5">
                  {t("summary.total")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-0 relative">
          {globalError ? (
            <div className="w-full max-w-sm mx-auto bg-card border border-red-500/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl animate-bounce-in">
              <div className="w-16 h-16 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-5 text-3xl shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                ⚠️
              </div>
              <h3 className="text-foreground font-black text-xl mb-2">
                {t("errors.documentRejected")}
              </h3>
              <p className="text-muted text-sm mb-8 font-medium px-2">
                {globalError || t("errors.scanDifferentSuffix")}
              </p>
              <button
                onClick={() => { clearError(); setScannerOpen(true); }}
                className="btn-primary w-full py-3.5"
              >
                {t("errors.scanDifferent")}
              </button>
            </div>
          ) : !scannerOpen ? (
            <div className="w-full max-w-sm mx-auto flex-1 max-h-[240px] rounded-3xl border border-border/10 bg-card flex flex-col items-center justify-center text-center px-6 shadow-md transition-all">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 text-2xl shadow-inner text-primary">
                📷
              </div>
              <h3 className="text-base font-bold text-foreground mb-1.5">
                {t("scanner.readyToScan")}
              </h3>
              <p className="text-xs font-medium text-muted mb-6">
                {t("scanner.openCameraMsg")}
              </p>
              <button
                className="btn-primary w-full max-w-[220px] py-3 shadow-lg shadow-primary/20"
                onClick={() => setScannerOpen(true)}
              >
                {t("scanner.startScan")}
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col justify-center overflow-hidden">
              <QRScanner
                onStop={() => setScannerOpen(false)}
                setLogs={setLogs}
                onScanSuccess={handleScanSuccess}
              />
            </div>
          )}
        </div>

        <div className="shrink-0 mt-4 pt-2 pb-8">
          <button
            className="w-full bg-card border border-border/20 text-foreground hover:bg-foreground/5 transition-colors rounded-2xl py-3.5 font-bold text-sm shadow-sm active:scale-[0.98]"
            onClick={() => navigateToStep(2)}
          >
            {t("scanner.manualEntry")}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // STEP 2 → Manual Entry
  // ==========================================
  if (step === 2) {
    return (
      <div className="space-y-4 flex flex-col h-full pb-10 animate-fade-in">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-foreground leading-tight">
              {t("manualEntry.title")}
            </h2>
            <p className="text-[12px] font-medium text-muted mt-0.5">
              {t("manualEntry.manualEntrySubtitle")}
            </p>
          </div>
          <button
            onClick={() => { clearError(); navigateToStep(1); }}
            className="text-sm text-primary font-bold px-3.5 py-1.5 bg-primary/10 hover:bg-primary/20 transition-colors rounded-lg"
          >
            ← {t("manualEntry.back")}
          </button>
        </div>
        <div className="shrink-0"><Progress /></div>
        <div className="flex-1 overflow-y-auto mt-2">
          <ManualEntryForm onSubmit={handleManualSubmit} />
        </div>
      </div>
    );
  }

  // ==========================================
  // STEP 3 → Verify
  // ==========================================
  if (step === 3) {
    return (
      <div className="flex flex-col h-full flex-1 pb-4 animate-fade-in">
        <div className="shrink-0 space-y-3 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-foreground leading-tight">
                {t("verify.title")}
              </h2>
              <p className="text-[11px] font-medium text-muted mt-0.5">{t("verify.subtitle")}</p>
            </div>
            <button
              onClick={() => navigateToStep(1)}
              className="text-xs font-bold text-primary hover:text-primary-dark transition-colors bg-primary/10 px-3 py-1.5 rounded-lg"
            >
              ← {t("verify.rescan")}
            </button>
          </div>
          <Progress />
        </div>
        <div className="flex-1 flex flex-col min-h-0 relative mt-2">
          {invoiceData ? (
            <InvoiceDetailsCard invoice={invoiceData} onConfirm={handleConfirmDelivery} />
          ) : null}
        </div>
      </div>
    );
  }

  // ==========================================
  // STEP 4 → Success
  // ==========================================
  if (step === 4) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4 pb-10 animate-bounce-in">
        <div className="w-28 h-28 rounded-full bg-emerald-500/10 border-[6px] border-emerald-500 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)] mb-8">
          <span className="text-6xl text-emerald-500">✓</span>
        </div>
        <h2 className="text-3xl font-black text-foreground mb-3 tracking-tight">
          {t("success.title")}
        </h2>
        <p className="text-muted text-base mb-10 max-w-[260px] font-medium leading-relaxed">
          {t("success.docPrefix")}
          <span className="text-foreground font-bold mx-1.5 px-2 py-0.5 bg-foreground/5 rounded-md">
            {invoiceData?.docNum}
          </span>
          {t("success.docSuffix")}
        </p>
        <button
          className="btn-primary w-full max-w-xs py-4 shadow-xl shadow-primary/20 hover:shadow-primary/40 text-lg"
          onClick={handleResetSession}
        >
          {t("success.nextBtn")}
        </button>
      </div>
    );
  }

  return null;
}




// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom"; // IMPORTED ROUTER HOOK
// import { useAuthStore } from "../../../store/useAuthStore";
// import { useDeliveryWorkflowStore } from "../store/useDeliveryWorkflowStore";
// import { uploadService } from "../../../services/uploadService";
// import { useGeolocation } from "../../../hooks/useGeolocation";
// import { useDeviceInfo } from "../../../hooks/useDeviceInfo";
// import { QRScanner } from "../scanner/QRScanner";
// import ManualEntryForm from "../manualentry/ManualEntryForm";
// import { CameraCapture } from "../proof/CameraCapture";
// import { ImageValidator } from "../proof/ImageValidator";
// import { Spinner } from "../../../components/common/Spinner";
// import { ErrorBanner } from "../../../components/common/ErrorBanner";
// import InvoiceDetailsCard from "../invoice/InvoiceDetailsCard";
// import { useDailyStatsQuery, usePostDelivery } from "../hooks/useDelivery";
// import { deliveryService } from "../services/deliveryService";
// import { useUIStore } from "../../../store/useUIStore";
// import { useTranslation } from "react-i18next";

// export default function DeliveryPage() {
//   const { isAuthenticated } = useAuthStore();
//   const [scannerOpen, setScannerOpen] = useState(false);
//   const [logs, setLogs] = useState([]);
//   const { globalError, clearError, setError } = useUIStore();
//   const { t, i18n } = useTranslation();
//   const { mutateAsync: submitDelivery } = usePostDelivery();

//   const {
//     step,
//     setStep,
//     scannedQR,
//     setScannedQR,
//     invoiceData,
//     setInvoiceData,
//     stats,
//     setCoordinates,
//     setUploadedImagePath,
//     // loading, setLoading,
//     // error, setError,
//     resetSession,
//   } = useDeliveryWorkflowStore();

//   const { capture: captureGPS } = useGeolocation();
//   const { getInfo } = useDeviceInfo();
//   const [posting, setPosting] = useState(false);
//   const { data: queryStats } = useDailyStatsQuery();
//   const displayStats = queryStats || stats;
//   console.log("invoice :", queryStats);

//   // ==========================================
//   // 🚀 ADVANCED URL SYNC & ROUTE GUARD LOGIC
//   // ==========================================
//   const [searchParams, setSearchParams] = useSearchParams();

//   // 1. Unified Navigation Function (Updates Store & URL simultaneously)
//   const navigateToStep = (newStep, specificDoc = null) => {
//     const targetDoc = specificDoc || scannedQR;
//     const params = new URLSearchParams();

//     params.set("step", newStep);

//     // Only attach the 'doc' parameter to the URL if we are on Step 3, 4, or 5
//     if (newStep >= 3 && targetDoc) {
//       params.set("doc", targetDoc);
//     }

//     setSearchParams(params);
//     setStep(newStep);
//   };

//   // 2. The Route Guard & Hydrator
//   useEffect(() => {
//     const urlStep = parseInt(searchParams.get("step")) || 1;
//     const urlDoc = searchParams.get("doc") || "";

//     // Guard: Block access to steps 3, 4, 5 if there is no document in the URL
//     if (urlStep >= 3 && !urlDoc) {
//       navigateToStep(1);
//       return;
//     }

//     // Hydration: If the user refreshed the page on Step 3, they have a URL doc but no internal data.
//     // We must intercept this, extract the doc, and auto-fetch the API!
//     if (urlStep >= 3 && urlDoc && !invoiceData) {
//       const parts = urlDoc.split("-");
//       if (parts.length >= 2) {
//         const docNum = parts[0].trim();
//         const docType = parseInt(parts[1].trim(), 10);

//         setScannedQR(urlDoc);
//         verifyDocument(docNum, docType, urlStep); // Pass the intended step so it resumes perfectly
//       } else {
//         navigateToStep(1); // Invalid format, kick to step 1
//       }
//       return;
//     }

//     // Normal Back/Forward Button Sync
//     if (step !== urlStep && invoiceData) {
//       setStep(urlStep);
//     }
//   }, [searchParams.get("step"), searchParams.get("doc")]);
//   // ==========================================

//   // --- THE API GATEKEEPER ---
//   // Added targetStep so hydration can resume exactly where the user refreshed (e.g. Step 4)
//  const verifyDocument = async (docNum, docType, targetStep = 3, isManual = false) => {
//     try {
//       // Clear any old errors first
//       clearError();
      
//       const data = await deliveryService.getDocument({ docNum, docType });
      
//       if (data) {
//         setInvoiceData(data);
//         const combinedDocString = `${docNum}-${docType}`;
//         setScannedQR(combinedDocString);
//         navigateToStep(targetStep, combinedDocString); 
//       }
      
//     } catch (err) {
//       // 🚀 1. Get the exact error message from the backend API
//       const backendMessage = err.response?.data?.message || err.message || "";

//       // 🚀 2. Intercept "already been posted"
//       if (backendMessage.includes("already been posted")) {
//         // Pass the docNum dynamic variable into the translation!
//         setError(t("errors.alreadyPosted", { docNum: docNum }));
//       } 
//       // 🚀 3. Intercept "Document not found"
//       else if (backendMessage.includes("Document not found")) {
//         setError(t("errors.invalidBarcode")); // Or use errors.documentRejected
//       } 
//       // 🚀 4. Fallback for any other random server errors
//       else {
//         setError(t("errors.documentRejected")); 
//       }

//       // 🚀 5. Kick back to Step 1 ONLY if they were scanning
//       if (!isManual) {
//         navigateToStep(1); 
//       }
//     }
//   };

//   const handleScanSuccess = (scannedText) => {
//     const parts = scannedText.split("-");
//     if (parts.length >= 2) {
//       verifyDocument(parts[0].trim(), parseInt(parts[1].trim(), 10), 3, false);
//     } else {
//       setError(t("errors.invalidBarcode"));
//     }
//   };

//   const handleManualSubmit = (docNum, docType) => {
//     verifyDocument(docNum, docType, 3, true);
//   };

//   const handleConfirmDelivery = async (details) => {
//     try {
//       // 1. Get GPS Directly
//       let coords = null;
//       try {
//         coords = await captureGPS();
//       } catch (gpsError) {
//         console.warn("GPS failed or was denied:", gpsError);
//       }

//       // 2. Extract only the FileNames from the image objects
//       const imageFileNames = details.images.map(
//         (img) => img.fileName || img.FileName,
//       );

//       // 3. Post to Backend using React Query!
//       const deviceInfo = getInfo();

//       // 🚀 Replaced deliveryService with mutateAsync
//       await submitDelivery({
//         DocumentNo: String(invoiceData?.docNum),
//         DocumentType: String(invoiceData?.docType),
//         Latitude: coords?.latitude || null,
//         Longitude: coords?.longitude || null,
//         DeviceId: deviceInfo?.deviceId || "UNKNOWN",
//         Images: imageFileNames,
//         Vehicle: details.vehicle || "",
//         Remarks: details.remarks || "",
//       });

//       // ==============================================================
//       // ✅ SUCCESS BLOCK: Only runs if the API returns a 200 OK!
//       // ==============================================================

//       // Clear the local storage
//       localStorage.removeItem(`temp_images_${invoiceData?.docNum}`);

//       // Navigate to the Success Screen
//       navigateToStep(4);
//     } catch (err) {
//       // ==============================================================
//       // ❌ ERROR BLOCK: API Failed. Stays on Step 3!
//       // ==============================================================
//       console.error("Delivery Post Failed:", err);

//       // 🚀 WE DELETED ALL THE ERROR PARSING!
//       // Because you set up the Global Axios Interceptor in the previous step,
//       // Axios will automatically catch this error and display the ErrorBanner
//       // at the top of the screen. We just need this catch block to stop
//       // the code from running navigateToStep(4).
//     }
//   };
//   const handleProofCaptured = async (file) => {
//     setLoading(true);
//     try {
//       const { imagePath } = await uploadService.uploadProof(file);
//       setUploadedImagePath(imagePath);
//       await handlePostDelivery(imagePath);
//     } catch (err) {
//       // setError(err.response?.data?.message || "Upload failed");
//     } finally {
//       // setLoading(false);
//     }
//   };

//   const handlePostDelivery = async (imagePath) => {
//     setPosting(true);
//     try {
//       const deviceInfo = getInfo();
//       await deliveryService.postDelivery({
//         DocumnentNumber: String(invoiceData?.docNum),
//         DocumentType: String(invoiceData?.docType),
//         Latitude: coordinates?.latitude,
//         Longitude: coordinates?.longitude,
//         DeviceId: deviceInfo.deviceId,
//         Images: [imagePath],
//       });
//       navigateToStep(5);
//     } catch (err) {
//       // setError(err.response?.data?.message || "Delivery failed");
//     } finally {
//       setPosting(false);
//     }
//   };

//   const handleResetSession = () => {
//     resetSession();
//     navigateToStep(1); // Clears the URL params entirely
//   };

//   const Progress = () => (
//     <div className="flex gap-2 mb-2">
//       {[1, 2, 3, 4, 5].map((s) => (
//         <div
//           key={s}
//           className={`h-1 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-white/10"}`}
//         />
//       ))}
//     </div>
//   );

//   // STEP 1 → Scanner
//   if (step === 1) {
//     return (
//       <div className="flex flex-col h-full flex-1 relative">
//         {/* {error && (
//           <div className="absolute top-0 inset-x-0 z-50 animate-fade-in">
//             <ErrorBanner message={error} onClose={() => setError(null)} />
//           </div>
//         )} */}

//         <div className="shrink-0 space-y-2 mb-3">
//           <div>
//             <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
//               {t("scanner.title")}
//             </h2>
//             <p className="text-[11px] text-muted">{t("scanner.subtitle")}</p>
//           </div>
//           <Progress />
//           <div>
//             <p className="text-[10px] text-muted uppercase tracking-widest mb-1.5 font-bold">
//               {t("summary.title")}
//             </p>
//             <div className="grid grid-cols-3 gap-2">
//               <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 py-2 text-center">
//                 <div className="text-lg font-bold text-amber-400">
//                   {displayStats?.open}
//                 </div>
//                 <div className="text-[9px] text-muted mt-0.5">
//                   {t("summary.open")}
//                 </div>
//               </div>
//               <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 py-2 text-center">
//                 <div className="text-lg font-bold text-emerald-400">
//                   {displayStats?.closed}
//                 </div>
//                 <div className="text-[9px] text-muted mt-0.5">
//                   {t("summary.closed")}
//                 </div>
//               </div>
//               <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 py-2 text-center">
//                 <div className="text-lg font-bold text-sky-400">
//                   {displayStats?.total}
//                 </div>
//                 <div className="text-[9px] text-muted mt-0.5">
//                   {t("summary.total")}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex-1 flex flex-col justify-center min-h-0 relative">
//           {globalError ? (
//             /* --- 🛑 ERROR STATE: Camera unmounted, Retake button shown --- */
//             <div className="w-full max-w-sm mx-auto bg-card/80 border border-red-500/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center backdrop-blur-md animate-fade-in shadow-xl">
//               <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4 text-3xl shadow-[0_0_20px_rgba(239,68,68,0.2)]">
//                 ⚠️
//               </div>
//               {/* 🚀 Translated Title */}
//               <h3 className="text-white font-bold text-lg mb-2">
//                 {t("errors.documentRejected")}
//               </h3>

//               {/* 🚀 Translated Message */}
//               <p className="text-muted text-sm mb-8">
//                 {globalError || t("errors.scanDifferentSuffix")}
//               </p>

//               <button
//                 onClick={() => {
//                   clearError();
//                   setScannerOpen(true);
//                 }}
//                 className="bg-primary text-white font-bold py-3.5 px-8 rounded-xl w-full transition-transform active:scale-95 shadow-lg"
//               >
//                 {/* 🚀 Translated Button */}
//                 {t("errors.scanDifferent")}
//               </button>
//             </div>
//           ) : !scannerOpen ? (
//             /* --- 📸 READY STATE --- */
//             <div className="w-full max-w-sm mx-auto flex-1 max-h-[200px] rounded-3xl border border-white/10 bg-card flex flex-col items-center justify-center text-center px-6 shadow-sm">
//               <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 text-xl">
//                 📷
//               </div>
//               <h3 className="text-sm font-semibold mb-1">
//                 {t("scanner.readyToScan")}
//               </h3>
//               <p className="text-[11px] text-muted mb-4">
//                 {t("scanner.openCameraMsg")}
//               </p>
//               <button
//                 className="btn-primary w-full max-w-[200px] py-2.5 text-sm rounded-xl font-bold"
//                 onClick={() => {
//                   setScannerOpen(true);
//                 }}
//               >
//                 {t("scanner.startScan")}
//               </button>
//             </div>
//           ) : (
//             /* --- 📹 ACTIVE SCANNER --- */
//             <div className="w-full h-full flex flex-col justify-center overflow-hidden">
//               <QRScanner
//                 onStop={() => setScannerOpen(false)}
//                 setLogs={setLogs}
//                 onScanSuccess={handleScanSuccess}
//               />
//             </div>
//           )}
//         </div>

//         <div className="shrink-0 mt-3 pt-1 pb-10">
//           <button
//             className="w-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors rounded-2xl py-3 font-medium text-sm"
//             onClick={() => {
//               navigateToStep(2);
//             }}
//           >
//             {t("scanner.manualEntry")}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // STEP 2 → Manual Entry
//   if (step === 2) {
//     return (
//       <div className="space-y-4 flex flex-col h-full pb-10">
//         <div className="flex items-center justify-between shrink-0">
//           <div>
//             <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
//               {t("manualEntry.title")}
//             </h2>
//             <p className="text-[11px] text-muted">
//               {t("manualEntry.manualEntrySubtitle")}
//             </p>
//           </div>

//           {/* 🚀 FIX: Clear the error when going back to the camera */}
//           <button
//             onClick={() => {
//               clearError();
//               navigateToStep(1);
//             }}
//             className="text-sm text-primary font-medium px-3 py-1 bg-primary/10 rounded-lg"
//           >
//             ← {t("manualEntry.back")}
//           </button>
//         </div>

//         <div className="shrink-0">
//           <Progress />
//         </div>

//         {/* {error && <ErrorBanner message={error} onClose={() => setError(null)} />} */}

//         <div className="flex-1 overflow-y-auto">
//           <ManualEntryForm
//             onSubmit={handleManualSubmit}
//             //  loading={loading}
//           />
//         </div>
//       </div>
//     );
//   }

//   if (step === 3) {
//     return (
//       <div className="flex flex-col h-full flex-1 pb-4">
//         <div className="shrink-0 space-y-2 mb-2">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-xl font-black tracking-tight text-white leading-tight">
//                 {t("verify.title")}
//               </h2>
//               <p className="text-[10px] text-muted">{t("verify.subtitle")}</p>
//             </div>
//             <button
//               onClick={() => navigateToStep(1)}
//               className="text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2.5 py-1 rounded-lg"
//             >
//               ← {t("verify.rescan")}
//             </button>
//           </div>
//           <Progress />
//         </div>

//         <div className="flex-1 flex flex-col min-h-0 relative">
//           {/* {loading ? (
//             <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
//               <Spinner label="Posting Final Delivery..." />
//             </div>
//           ) :  */}
//           {/* {error ? (
//             <div className="pt-2"><ErrorBanner message={error} onClose={() => setError(null)} /></div>
//           ) : */}
//           {invoiceData ? (
//             <InvoiceDetailsCard
//               invoice={invoiceData}
//               onConfirm={handleConfirmDelivery}
//             />
//           ) : null}
//         </div>
//       </div>
//     );
//   }

//   // STEP 4 → Success (Previously Step 5)
//   if (step === 4) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full text-center px-4 pb-10">
//         <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6 animate-scale-in">
//           <span className="text-5xl text-emerald-400">✓</span>
//         </div>
//         <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
//           {t("success.title")}
//         </h2>
//         <p className="text-muted text-sm mb-8 max-w-[250px]">
//           {t("success.docPrefix")}
//           <span className="text-white font-mono font-bold mx-1">
//             {invoiceData?.docNum}
//           </span>{" "}
//           {t("success.docSuffix")}
//         </p>
//         <button
//           className="btn-primary w-full max-w-xs py-4 rounded-xl font-bold text-lg"
//           onClick={handleResetSession}
//         >
//           {t("success.nextBtn")}
//         </button>
//       </div>
//     );
//   }

//   // You can safely delete the old 'if (step === 5)' block entirely!
//   return null;
// }