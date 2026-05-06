import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useDeliveryWorkflowStore } from '../../../features/delivery/store/useDeliveryWorkflowStore';
import { deliveryService } from '../../../services/deliveryService';
import { invoiceService } from '../../../services/invoiceService';
import { uploadService } from '../../../services/uploadService';
import { useGeolocation } from '../../../hooks/useGeolocation';
import { useDeviceInfo } from '../../../hooks/useDeviceInfo';

import { Screen } from '../../../layout/Screen';
import { LoginForm } from '../../auth/pages/LoginForm';
import { StatsCard } from '../../../components/dashboard/StatsCard';
import { ScanButton } from '../../../components/dashboard/ScanButton';
import { QRScanner } from '../scanner/QRScanner';
import { InvoiceCard } from '../../../components/invoice/InvoiceCard';
import { CameraCapture } from '../proof/CameraCapture';
import { ImageValidator } from '../proof/ImageValidator';
import { Spinner } from '../../../components/common/Spinner';
import { ErrorBanner } from '../../../components/common/ErrorBanner';
import { ConfirmModal } from '../../../components/common/ConfirmModal';

const STEPS = ['Login', 'Dashboard', 'Scan QR', 'Invoice', 'Proof', 'Done'];

export default function DeliveryPage() {
  const { isAuthenticated, logout } = useAuthStore();
  const {
    step, setStep,
    scannedQR,
    invoice, setInvoice,
    stats, setStats,
    proofImageFile, proofImageUrl,
    coordinates, setCoordinates,
    setUploadedImagePath,
    loading, setLoading,
    error, setError,
    resetSession,
  } = useDeliveryWorkflowStore();

  const { capture: captureGPS } = useGeolocation();
  const { getInfo } = useDeviceInfo();

  const [confirmLogout, setConfirmLogout] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
console.log("isAuthenticated :",isAuthenticated);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) setStep(0);
  }, [isAuthenticated, setStep]);

  // Load daily stats when dashboard is visible
  useEffect(() => {
    if (isAuthenticated) {
      deliveryService.getDailyStats()
        .then(setStats)
        .catch(() => {});
    }
  }, [step, isAuthenticated, setStats]);

  // Fetch invoice after QR scan
  useEffect(() => {
    if (step === 3 && scannedQR) {
      setLoading(true);
      setError(null);
      invoiceService.fetchInvoice(scannedQR)
        .then(setInvoice)
        .catch((err) => {
          setError(err.response?.data?.message || 'Failed to fetch invoice. Please re-scan.');
          setStep(2);
        })
        .finally(() => setLoading(false));
    }
  }, [step, scannedQR, setInvoice, setLoading, setError, setStep]);

  const handleConfirmDelivery = async () => {
    setStep(4);
    try {
      const coords = await captureGPS();
      setCoordinates(coords);
    } catch {
      // GPS optional — proceed without
    }
  };

  const handleProofCaptured = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const { imagePath } = await uploadService.uploadProof(file);
      setUploadedImagePath(imagePath);
      handlePostDelivery(imagePath);
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed. Please retry.');
      setLoading(false);
    }
  };

  const handlePostDelivery = async (imagePath) => {
    setPosting(true);
    try {
      const deviceInfo = getInfo();
      await deliveryService.postDelivery({
        invoiceNumber: scannedQR,
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
        deviceId: deviceInfo.deviceId,
        imagePath,
      });
      setPostSuccess(true);
      setStep(5);
    } catch (err) {
      setError(err.response?.data?.message || 'Delivery posting failed. Please retry.');
    } finally {
      setPosting(false);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    resetSession();
    setStep(0);
  };

  // ─── Step 0: Login ────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="screen">
        <LoginForm />
      </div>
    );
  }

  // ─── Step 1: Dashboard ───────────────────────────────────────────
  if (step === 1) {
    return (
      <Screen title="Dashboard" step={1} totalSteps={5}>
        <div className="space-y-6">
          <div>
            <p className="text-xs text-muted uppercase tracking-widest mb-3 font-medium">Today's Summary</p>
            <StatsCard open={stats.open} closed={stats.closed} total={stats.total} />
          </div>
          <ScanButton onClick={() => setStep(2)} />
          <button
            id="logout-btn"
            onClick={() => setConfirmLogout(true)}
            className="w-full text-sm text-muted hover:text-red-400 transition-colors py-2"
          >
            Sign Out
          </button>
        </div>

        <ConfirmModal
          isOpen={confirmLogout}
          title="Sign Out"
          message="Are you sure you want to sign out?"
          onConfirm={handleLogout}
          onCancel={() => setConfirmLogout(false)}
          confirmLabel="Sign Out"
          danger
        />
      </Screen>
    );
  }

  // ─── Step 2: QR Scanner ──────────────────────────────────────────
  if (step === 2) {
    return (
      <Screen title="Scan Invoice" showBack onBack={() => setStep(1)} step={2} totalSteps={5}>
        <QRScanner />
      </Screen>
    );
  }

  // ─── Step 3: Invoice Validation ──────────────────────────────────
  if (step === 3) {
    return (
      <Screen title="Invoice Details" showBack onBack={() => setStep(2)} step={3} totalSteps={5}>
        {loading ? (
          <div className="flex justify-center py-12"><Spinner label="Fetching invoice..." /></div>
        ) : error ? (
          <div className="space-y-4">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
            <button onClick={() => setStep(2)} className="btn-primary w-full">Re-scan</button>
          </div>
        ) : invoice ? (
          <InvoiceCard
            invoice={invoice}
            onConfirm={handleConfirmDelivery}
            onRescan={() => setStep(2)}
          />
        ) : null}
      </Screen>
    );
  }

  // ─── Step 4: Proof Capture ───────────────────────────────────────
  if (step === 4) {
    return (
      <Screen title="Delivery Proof" showBack onBack={() => setStep(3)} step={4} totalSteps={5}>
        <div className="space-y-4">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
          <CameraCapture onCaptured={handleProofCaptured} />
          {proofImageUrl && (
            <ImageValidator imageUrl={proofImageUrl} />
          )}
          {(loading || posting) && (
            <div className="flex justify-center py-4">
              <Spinner label={posting ? 'Posting delivery...' : 'Uploading image...'} />
            </div>
          )}
        </div>
      </Screen>
    );
  }

  // ─── Step 5: Success ─────────────────────────────────────────────
  if (step === 5) {
    return (
      <Screen title="Delivery Complete" step={5} totalSteps={5}>
        <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shadow-glow-green animate-bounce-in">
            <span className="text-4xl">✓</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Delivery Confirmed!</h2>
            <p className="text-muted text-sm mt-1">Invoice <span className="text-white font-mono">{scannedQR}</span> has been posted.</p>
          </div>
          <button
            id="next-delivery-btn"
            onClick={resetSession}
            className="btn-primary w-full max-w-xs"
          >
            Next Delivery
          </button>
        </div>
      </Screen>
    );
  }

  return null;
}
