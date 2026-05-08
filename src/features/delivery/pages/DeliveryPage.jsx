import { useState } from "react";
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
import { useDailyStatsQuery, useDocumentQuery } from "../hooks/useDelivery";
import { useEffect } from "react";
import { deliveryService } from "../services/deliveryService";
import InvoiceDetailsCard from "../invoice/InvoiceDetailsCard";

export default function DeliveryPage() {
  const { isAuthenticated } = useAuthStore();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  
  const {
    step, setStep,
    scannedQR, setScannedQR,
    invoiceData, setInvoiceData,
    stats, setCoordinates,
    setUploadedImagePath,
    loading, setLoading,
    error, setError,
    resetSession,
  } = useDeliveryWorkflowStore();

  const { capture: captureGPS } = useGeolocation();
  const { getInfo } = useDeviceInfo();
  const [posting, setPosting] = useState(false);
  const { data: queryStats } = useDailyStatsQuery();
  const displayStats = queryStats || stats;
  // const { data: documentData } = useDocumentQuery(scannedQR);

  // --- THE API GATEKEEPER ---
  const verifyDocument = async (docNum, docType) => {
    // 1. THIS IS HOW YOU TRACK THE API CALL:
    console.log("🚀 TRIGGERING API CALL FOR:", { docNum, docType });
    
    setLoading(true);
    setError(null);

    try {
      // 2. THIS PASSES docNum AND docType DIRECTLY TO YOUR SERVICE
      const data = await deliveryService.getDocument({ docNum, docType });
      
      console.log("✅ API SUCCESS! Data received:", data);
      
      if (data) {
        setInvoiceData(data); // Save the data
        setStep(3);       // Move to Step 3 safely!
      } else {
        throw new Error("Invalid document data received.");
      }
    } catch (err) {
      console.error("❌ API FAILED:", err);
      setError(err.response?.data?.message || "Document number not valid or not found.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for QR Scanner
  const handleScanSuccess = (scannedText) => {
    setScannedQR(scannedText);
    
    // Split the barcode: "26009707-13" -> ["26009707", "13"]
    const parts = scannedText.split("-");
    
    if (parts.length >= 2) {
      const docNum = parts[0].trim();
      const docType = parseInt(parts[1].trim(), 10);
      verifyDocument(docNum, docType);
    } else {
      setError("Invalid barcode format. Expected DOCNUM-DOCTYPE.");
    }
  };

  // Handler for Manual Entry
  const handleManualSubmit = (docNum, docType) => {
    setScannedQR(`${docNum}-${docType}`); // Save standard format for logs
    verifyDocument(docNum, docType);
  };

  const handleConfirmDelivery = async () => {
    setStep(4);
    try {
      const coords = await captureGPS();
      setCoordinates(coords);
    } catch {}
  };

  const handleProofCaptured = async (file) => {
    setLoading(true);
    try {
      const { imagePath } = await uploadService.uploadProof(file);
      setUploadedImagePath(imagePath);
      await handlePostDelivery(imagePath);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelivery = async (imagePath) => {
    setPosting(true);
    try {
      const deviceInfo = getInfo();
      await deliveryService.postDelivery({
        invoiceNumber: invoiceData?.docNum, // Use verified docNum
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
        deviceId: deviceInfo.deviceId,
        imagePath,
      });
      setStep(5);
    } catch (err) {
      setError(err.response?.data?.message || "Delivery failed");
    } finally {
      setPosting(false);
    }
  };

  const Progress = () => (
    <div className="flex gap-2 mb-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-white/10"}`} />
      ))}
    </div>
  );

  // STEP 1 → Scanner
  if (step === 1) {
    return (
      <div className="flex flex-col h-full flex-1 relative">
        {/* Global Error Overlay for Step 1 */}
        {error && (
          <div className="absolute top-0 inset-x-0 z-50 animate-fade-in">
            <ErrorBanner message={error} onClose={() => setError(null)} />
          </div>
        )}

        <div className="shrink-0 space-y-2 mb-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white leading-tight">Scan Document</h2>
            <p className="text-[11px] text-muted">Scan QR or barcode</p>
          </div>
          <Progress />
          <div>
            <p className="text-[10px] text-muted uppercase tracking-widest mb-1.5 font-bold">Today's Summary</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 py-2 text-center">
                <div className="text-lg font-bold text-amber-400">{displayStats?.open}</div>
                <div className="text-[9px] text-muted mt-0.5">OPEN</div>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 py-2 text-center">
                <div className="text-lg font-bold text-emerald-400">{displayStats?.closed}</div>
                <div className="text-[9px] text-muted mt-0.5">CLOSED</div>
              </div>
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 py-2 text-center">
                <div className="text-lg font-bold text-sky-400">{displayStats?.total}</div>
                <div className="text-[9px] text-muted mt-0.5">TOTAL</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-0 relative">
          {/* Loading Overlay blocking scanner while verifying */}
          {loading && (
             <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-3xl">
               <Spinner label="Verifying Document..." />
             </div>
          )}

          {!scannerOpen ? (
            <div className="w-full max-w-sm mx-auto flex-1 max-h-[200px] rounded-3xl border border-white/10 bg-card flex flex-col items-center justify-center text-center px-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 text-xl">📷</div>
              <h3 className="text-sm font-semibold mb-1">Ready to Scan</h3>
              <p className="text-[11px] text-muted mb-4">Open camera to scan document</p>
              <button className="btn-primary w-full max-w-[200px] py-2.5 text-sm rounded-xl font-bold" onClick={() => { setError(null); setScannerOpen(true); }}>
                Start Scan
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col justify-center overflow-hidden">
              <QRScanner onStop={() => setScannerOpen(false)} setLogs={setLogs} onScanSuccess={handleScanSuccess} />
            </div>
          )}
        </div>

        <div className="shrink-0 mt-3 pt-1">
          <button className="w-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors rounded-2xl py-3 font-medium text-sm" onClick={() => { setError(null); setStep(2); }}>
            Manual Entry
          </button>
        </div>
      </div>
    );
  }

  // STEP 2 → Manual Entry
  if (step === 2) {
    return (
      <div className="space-y-4 flex flex-col h-full">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white leading-tight">Manual Entry</h2>
            <p className="text-[11px] text-muted">Enter document details</p>
          </div>
          <button onClick={() => setStep(1)} className="text-sm text-primary font-medium px-3 py-1 bg-primary/10 rounded-lg">
            ← Back
          </button>
        </div>
        
        <div className="shrink-0"><Progress /></div>

        {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

        <div className="flex-1 overflow-y-auto">
           <ManualEntryForm onSubmit={handleManualSubmit} loading={loading} />
        </div>
      </div>
    );
  }

  // STEP 3 → Document Details (VERIFIED DATA)
  if (step === 3) {
    return (
      <div className="flex flex-col h-full flex-1">
        
        {/* Top Header */}
        <div className="shrink-0 space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white leading-tight">Verify Document</h2>
              <p className="text-[11px] text-muted mt-0.5">Confirm invoice details</p>
            </div>
            <button onClick={() => setStep(1)} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              ← Rescan
            </button>
          </div>
          <Progress />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Debug Box - Shows exactly what the API is trying to fetch */}
          <div className="p-3 mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shrink-0">
            <p className="text-[9px] uppercase tracking-widest mb-1 font-bold opacity-70">
              Fetching Data For:
            </p>
            <p className="font-mono text-sm break-all">
              {scannedQR || "No data captured"}
            </p>
          </div>

          {/* Conditional Rendering */}
          <div className="flex-1 overflow-y-auto pb-4">
            {loading ? (
              <div className="h-40 flex items-center justify-center">
                <Spinner label="Fetching document details..." />
              </div>
            ) : error ? (
              <ErrorBanner message={error} />
            ) : invoiceData ? (
              <InvoiceDetailsCard
                invoice={invoiceData}
                onConfirm={handleConfirmDelivery}
                onRescan={() => setStep(1)}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
  // STEP 4 → Proof
  if (step === 4) {
    return (
      <div className="space-y-4 flex flex-col h-full">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white leading-tight">Delivery Proof</h2>
            <p className="text-[11px] text-muted">Capture delivery image</p>
          </div>
          <button onClick={() => setStep(3)} className="text-sm text-primary font-medium px-3 py-1 bg-primary/10 rounded-lg">
            ← Back
          </button>
        </div>

        <div className="shrink-0"><Progress /></div>

        <div className="flex-1 overflow-hidden relative rounded-2xl">
           <CameraCapture onCaptured={handleProofCaptured} />
           {(loading || posting) && (
             <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
               <Spinner label={posting ? "Posting delivery..." : "Uploading image..."} />
             </div>
           )}
        </div>
      </div>
    );
  }

  // STEP 5 → Success
  if (step === 5) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6 animate-scale-in">
          <span className="text-5xl text-emerald-400">✓</span>
        </div>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Confirmed!</h2>
        <p className="text-muted text-sm mb-8 max-w-[250px]">
          Document <span className="text-white font-mono font-bold mx-1">{invoiceData?.docNum}</span> has been securely posted and recorded.
        </p>
        <button className="btn-primary w-full max-w-xs py-4 rounded-xl font-bold text-lg" onClick={resetSession}>
          Next Delivery
        </button>
      </div>
    );
  }

  return null;
}