import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../store/useAuthStore";
import { useDeliveryHistory } from "../../delivery/hooks/useDelivery";

export default function HistoryPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  // 🚀 1. Fetch real data directly from your hook!
  const { data: historyData, isLoading } = useDeliveryHistory();

  // 🚀 2. State for the Full-Screen Image Viewer
  const [viewerImages, setViewerImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Helper function to format dates nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (isToday) return `${t("history.today")}, ${time}`;
    return `${date.toLocaleDateString()} ${time}`;
  };

  // 🚀 3. Helper function to extract URLs from the JSON strings
  const extractImages = (item) => {
    const images = [];
    try {
      if (item.imageData1) {
        const parsed1 = JSON.parse(item.imageData1);
        if (parsed1.PublicUrl) images.push(parsed1.PublicUrl);
      }
      if (item.imageData2) {
        const parsed2 = JSON.parse(item.imageData2);
        if (parsed2.PublicUrl) images.push(parsed2.PublicUrl);
      }
    } catch (e) {
      console.error("Failed to parse image data", e);
    }
    return images;
  };

  // Open the Image Viewer Modal
  const openViewer = (images) => {
    if (images && images.length > 0) {
      setViewerImages(images);
      setCurrentImageIndex(0);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full pb-10 animate-fade-in">
        {/* Header section */}
        <div className="mb-6 px-1">
          <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
            {t("history.title")}
          </h2>
          <p className="text-[12px] text-muted font-medium mt-1">
            {t("history.subtitle")}
          </p>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-4">
          {isLoading ? (
            // Loading Skeletons
            [1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-24 bg-card/40 rounded-2xl animate-pulse border border-white/5"
              ></div>
            ))
          ) : !historyData || historyData.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-40 opacity-50">
              <span className="text-4xl mb-3">📭</span>
              <p className="text-sm text-muted">{t("history.noData")}</p>
            </div>
          ) : (
            // History Cards
            historyData.map((item, index) => {
              const images = extractImages(item);

              return (
                <div
                  key={index}
                  className="bg-card/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-lg"
                >
                  {/* 🚀 Image Thumbnail Box */}
                  <div
                    onClick={() => openViewer(images)}
                    className={`w-14 h-14 shrink-0 rounded-xl overflow-hidden flex gap-0.5 border border-white/10 bg-black/50 ${images.length > 0 ? "cursor-pointer active:scale-95 transition-transform" : ""}`}
                  >
                    {images.length > 0 ? (
                      // If images exist, map them side-by-side inside the box
                      images.map((imgUrl, i) => (
                        <img
                          key={i}
                          src={imgUrl}
                          alt="Proof"
                          className="flex-1 object-cover h-full min-w-0"
                        />
                      ))
                    ) : (
                      // Fallback checkmark if no images exist
                      <div className="w-full h-full flex items-center justify-center text-emerald-400 bg-emerald-500/10">
                        ✓
                      </div>
                    )}
                  </div>

                  {/* Data */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-white font-bold text-sm truncate">
                        {t("history.billNo")}:{" "}
                        <span className="text-primary">{item.documentNo}</span>
                      </h3>
                      {/* Status Badge */}
                      <span className="text-[9px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                        {item.status?.toLowerCase() === "closed" || !item.status
                          ? t("history.statusSuccess")
                          : item.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted mb-1 flex items-center gap-1.5">
                      <span>⏱️ {formatDate(item.createdAt)}</span>
                    </p>
                    <p className="text-[10px] text-muted/80">
                      {t("history.vehicle")}:{" "}
                      <span className="text-gray-300 font-medium">
                        {item.vehicleNumber || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 🔴 FULL SCREEN IMAGE CAROUSEL MODAL */}
      {viewerImages && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col animate-fade-in">
          {/* Top Bar with Close Button */}
          <div className="flex justify-between items-center p-4">
            <span className="text-white font-bold tracking-wide">
              {currentImageIndex + 1} / {viewerImages.length}
            </span>
            <button
              onClick={() => setViewerImages(null)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Main Image Viewer */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
            <img
              src={viewerImages[currentImageIndex]}
              alt="Delivery Proof"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
          </div>

          {/* Carousel Controls (Only show if there is more than 1 image) */}
          {viewerImages.length > 1 && (
            <div className="p-6 flex justify-center gap-6 pb-12">
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev > 0 ? prev - 1 : viewerImages.length - 1,
                  )
                }
                className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold active:bg-white/20 transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev < viewerImages.length - 1 ? prev + 1 : 0,
                  )
                }
                className="px-6 py-3 rounded-xl bg-primary text-white font-bold active:bg-primary/80 transition-colors shadow-lg shadow-primary/20"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
