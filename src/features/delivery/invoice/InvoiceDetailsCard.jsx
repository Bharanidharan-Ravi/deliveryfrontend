import { useState, useEffect, useRef } from "react";
import { uploadService } from "../services/uploadService";
import { Spinner } from "../../../components/common/Spinner";
import { useTranslation } from "react-i18next";

export default function InvoiceDetailsCard({ invoice, onConfirm }) {
  const [vehicle, setVehicle] = useState(invoice?.vehicle || "");
  const [remarks, setRemarks] = useState("");
  const storageKey = `temp_images_${invoice?.docNum}`;
  const { t } = useTranslation();
  
  const [uploadedImages, setUploadedImages] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (invoice?.docNum) {
      localStorage.setItem(storageKey, JSON.stringify(uploadedImages));
    }
  }, [uploadedImages, invoice?.docNum]);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(null);

  useEffect(() => {
    if (invoice?.vehicle) setVehicle(invoice.vehicle);
  }, [invoice?.vehicle]);

  useEffect(() => {
    let activeStream = null;
    if (isCameraOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          activeStream = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Camera error:", err);
          alert("Camera access denied.");
          setIsCameraOpen(false);
        });
    }
    return () => {
      if (activeStream)
        activeStream.getTracks().forEach((track) => track.stop());
    };
  }, [isCameraOpen]);

  const getDocTypeName = (type) => {
    const typeStr = String(type);
    if (typeStr === "13" || typeStr === "1") return "Invoice";
    if (typeStr === "15" || typeStr === "2") return "Delivery";
    return `Document (${type})`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    return `₹${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `proof_${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          setPreviewFile(file);
          setPreviewUrl(URL.createObjectURL(blob));
          setPreviewSource("camera");
          setIsCameraOpen(false);
        }
      },
      "image/jpeg",
      0.8,
    );
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const isDuplicate = uploadedImages.some(
        (img) => (img.fileName || img.FileName) === file.name,
      );

      if (isDuplicate) {
        alert("You have already added this image!");
        e.target.value = ""; 
        return;
      }

      setPreviewFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPreviewSource("upload");
      e.target.value = "";
    }
  };

  const handleRetake = () => {
    setPreviewFile(null);
    setPreviewUrl(null);
    if (previewSource === "camera") setIsCameraOpen(true);
    else handleFileUploadClick();
  };

  const handleAcceptImage = async () => {
    try {
      const documentNumberString = String(invoice?.docNum);
      const tempResponse = await uploadService.uploadProofToTemp(
        previewFile,
        documentNumberString,
      );
      setUploadedImages((prev) => [...prev, tempResponse]);
      setPreviewFile(null);
      setPreviewUrl(null);
      setPreviewSource(null);
    } catch (err) {
      alert("Failed to upload image. Please try again.");
    } 
  };

  const handleRemoveImage = async (indexToRemove, e) => {
    if (e) e.stopPropagation(); 
    const imgObj = uploadedImages[indexToRemove];
    const targetFileName = imgObj.fileName || imgObj.FileName;

    try {
      await uploadService.deleteTempProof(
        String(invoice?.docNum),
        targetFileName,
      );
      setUploadedImages((prev) => prev.filter((_, i) => i !== indexToRemove));
    } catch (err) {
      console.error("Failed to delete temp file", err);
      alert("Failed to remove image from server.");
    }
  };

  const isValid = vehicle.trim().length > 0 && uploadedImages.length > 0;

  return (
    <div className="flex flex-col h-full w-full relative">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 1. DATA GRID */}
      {/* 🚀 FIXED: bg-white/5 -> bg-foreground/5, border-white/10 -> border-border/10 */}
      <div className="shrink-0 bg-foreground/5 border border-border/10 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="mb-3 pb-2 border-b border-border/10">
          <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-0.5">
            {t("verify.customer")}
          </p>
          <p className="text-sm font-bold text-foreground truncate">
            {invoice?.cardName || "Unknown"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          <div>
            <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-0.5">
              {t("verify.docType")}
            </p>
            <p className="text-xs font-bold text-foreground/80">
              {getDocTypeName(invoice?.docType)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-0.5">
              {t("verify.docNumber")}
            </p>
            <p className="text-xs font-mono font-bold text-primary">
              {invoice?.docNum}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-0.5">
              {t("verify.quantity")}
            </p>
            <p className="text-xs font-bold text-foreground/80">
              {invoice?.quantity || 0} {t("verify.units")}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-0.5">
              {t("verify.outstanding")}
            </p>
            <p className="text-xs font-bold text-amber-500">
              {formatCurrency(invoice?.docTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* 2. INPUT FORM */}
      <div className="shrink-0 space-y-4">
        <div>
          <label className="text-[10px] text-muted uppercase tracking-widest font-bold mb-1 block ml-1">
            {t("verify.vehicleNumber")} <span className="text-red-400">*</span>
          </label>
          {/* 🚀 FIXED: Inputs now respect Light/Dark theme perfectly */}
          <input
            type="text"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value.toUpperCase())}
            placeholder="e.g. TN0004"
            className="w-full px-4 py-3.5 text-sm rounded-xl border border-border/20 bg-background text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-bold uppercase transition-all placeholder:text-muted/50 placeholder:normal-case"
          />
        </div>

        <div>
          <label className="text-[10px] text-muted uppercase tracking-widest font-bold mb-1 block ml-1">
            {t("verify.remarks")}
          </label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={t("verify.remarksPlaceholder")}
            className="w-full px-4 py-3.5 text-sm rounded-xl border border-border/20 bg-background text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium transition-all placeholder:text-muted/50"
          />
        </div>

        {/* THUMBNAILS & CONTROLS */}
        <div>
          <label className="text-[10px] text-muted uppercase tracking-widest font-bold mb-2 block ml-1">
            {t("verify.deliveryProof")} <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-4">
            {uploadedImages.map((img, index) => (
              <div key={index} className="relative w-[56px] h-[56px] shrink-0">
                <img
                  src={img.publicUrl || img.PublicUrl}
                  alt="Proof"
                  onClick={() => setCarouselIndex(index)}
                  className="w-full h-full object-cover rounded-lg border border-border/20 shadow-md cursor-pointer active:scale-95 transition-transform"
                />
                <button
                  onClick={(e) => handleRemoveImage(index, e)}
                  className="absolute -top-2 -right-2 w-[22px] h-[22px] bg-red-500 text-white flex items-center justify-center rounded-full shadow-lg text-[10px] border-2 border-background active:scale-90 transition-transform"
                >
                  ✕
                </button>
              </div>
            ))}

            {uploadedImages.length < 2 && (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsCameraOpen(true)}
                  className="w-[56px] h-[56px] flex items-center justify-center rounded-lg border-2 border-dashed border-primary/50 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </button>
                <button
                  onClick={handleFileUploadClick}
                  className="w-[56px] h-[56px] flex items-center justify-center rounded-lg border-2 border-dashed border-sky-500/50 text-sky-500 bg-sky-500/5 hover:bg-sky-500/10 transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM FIXED BUTTON */}
      <div className="mt-auto shrink-0 pt-6">
        <button
          onClick={() => onConfirm({ vehicle, remarks, images: uploadedImages })}
          disabled={!isValid}
          className="btn-primary w-full py-4 rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
        >
          {t("verify.postDelivery")}
        </button>
      </div>

      {/* ========================================================= */}
      {/* 📸 MODALS: DELIBERATELY KEPT DARK (bg-black) FOR BEST UX! */}
      {/* ========================================================= */}
      
      {/* 🔴 LIVE CAMERA MODAL */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in">
          <div className="flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 inset-x-0 z-10">
            <span className="text-white font-bold tracking-wide">
             {t("proof.capture")}
            </span>
            <button
              onClick={() => setIsCameraOpen(false)}
              className="text-white text-sm font-medium px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors"
            >
              {t("proof.cancel")}
            </button>
          </div>
          <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-10 border-2 border-white/20 rounded-2xl pointer-events-none border-dashed shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"></div>
          </div>
          <div className="h-32 bg-black flex items-center justify-center pb-8 shrink-0">
            <button onClick={takePhoto} className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <div className="w-12 h-12 bg-white rounded-full active:scale-90 transition-transform"></div>
            </button>
          </div>
        </div>
      )}

      {/* 🟢 RETAKE MODAL */}
      {previewUrl && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-fade-in">
          <p className="text-white font-bold mb-4">{t("proof.confirmImage")}</p>
          <img src={previewUrl} alt="Preview" className="max-h-[60vh] max-w-full rounded-2xl border border-white/20 mb-8 object-contain shadow-2xl" />
          <div className="flex gap-4 w-full max-w-xs">
            <button onClick={handleRetake} className="flex-1 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-colors">
              {t("proof.retake")}
            </button>
            <button onClick={handleAcceptImage} className="flex-1 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30">
              {t("proof.looksGood")}
            </button>
          </div>
        </div>
      )}

      {/* 🔵 IMAGE CAROUSEL MODAL */}
      {carouselIndex !== null && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex flex-col animate-fade-in">
          <div className="flex justify-between items-center p-4 absolute top-0 inset-x-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
            <span className="text-white font-medium text-sm">
              {carouselIndex + 1} / {uploadedImages.length}
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => { handleRemoveImage(carouselIndex, e); setCarouselIndex(null); }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
              <button
                onClick={() => setCarouselIndex(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={uploadedImages[carouselIndex]?.publicUrl || uploadedImages[carouselIndex]?.PublicUrl}
              className="max-w-full max-h-[80vh] rounded-xl shadow-2xl object-contain"
            />
          </div>

          {uploadedImages.length > 1 && (
            <div className="h-20 flex justify-center items-center gap-8 shrink-0 pb-4">
              <button
                onClick={() => setCarouselIndex(carouselIndex === 0 ? uploadedImages.length - 1 : carouselIndex - 1)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10"
              >
                ←
              </button>
              <button
                onClick={() => setCarouselIndex(carouselIndex === uploadedImages.length - 1 ? 0 : carouselIndex + 1)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10"
              >
                →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}




// import { useState, useEffect, useRef } from "react";
// import { uploadService } from "../services/uploadService";
// import { Spinner } from "../../../components/common/Spinner";
// import { useTranslation } from "react-i18next";

// export default function InvoiceDetailsCard({ invoice, onConfirm }) {
//   const [vehicle, setVehicle] = useState(invoice?.vehicle || "");
//   const [remarks, setRemarks] = useState("");
//   const storageKey = `temp_images_${invoice?.docNum}`;
//   const { t } = useTranslation();
  
//   const [uploadedImages, setUploadedImages] = useState(() => {
//     const saved = localStorage.getItem(storageKey);
//     return saved ? JSON.parse(saved) : [];
//   });

//   // 🚀 FIX: Save to LocalStorage instantly whenever an image is added/removed
//   useEffect(() => {
//     if (invoice?.docNum) {
//       localStorage.setItem(storageKey, JSON.stringify(uploadedImages));
//     }
//   }, [uploadedImages, invoice?.docNum]);
//   // --- CAMERA & UPLOAD STATE ---
//   const [isCameraOpen, setIsCameraOpen] = useState(false);
//   const videoRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const [previewFile, setPreviewFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [previewSource, setPreviewSource] = useState(null);
//   // const [isUploading, setIsUploading] = useState(false);

//   // Carousel State
//   const [carouselIndex, setCarouselIndex] = useState(null);

//   useEffect(() => {
//     if (invoice?.vehicle) setVehicle(invoice.vehicle);
//   }, [invoice?.vehicle]);

//   useEffect(() => {
//     let activeStream = null;
//     if (isCameraOpen) {
//       navigator.mediaDevices
//         .getUserMedia({ video: { facingMode: "environment" } })
//         .then((stream) => {
//           activeStream = stream;
//           if (videoRef.current) videoRef.current.srcObject = stream;
//         })
//         .catch((err) => {
//           console.error("Camera error:", err);
//           alert("Camera access denied.");
//           setIsCameraOpen(false);
//         });
//     }
//     return () => {
//       if (activeStream)
//         activeStream.getTracks().forEach((track) => track.stop());
//     };
//   }, [isCameraOpen]);

//   const getDocTypeName = (type) => {
//     const typeStr = String(type);
//     if (typeStr === "13" || typeStr === "1") return "Invoice";
//     if (typeStr === "15" || typeStr === "2") return "Delivery";
//     return `Document (${type})`;
//   };

//   const formatCurrency = (amount) => {
//     if (!amount) return "₹0.00";
//     return `₹${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };

//   const takePhoto = () => {
//     if (!videoRef.current) return;
//     const canvas = document.createElement("canvas");
//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

//     canvas.toBlob(
//       (blob) => {
//         if (blob) {
//           const file = new File([blob], `proof_${Date.now()}.jpg`, {
//             type: "image/jpeg",
//           });
//           setPreviewFile(file);
//           setPreviewUrl(URL.createObjectURL(blob));
//           setPreviewSource("camera");
//           setIsCameraOpen(false);
//         }
//       },
//       "image/jpeg",
//       0.8,
//     );
//   };

//   const handleFileUploadClick = () => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // 🚀 NEW: Prevent duplicate uploads by checking the file name
//       const isDuplicate = uploadedImages.some(
//         (img) => (img.fileName || img.FileName) === file.name,
//       );

//       if (isDuplicate) {
//         alert("You have already added this image!");
//         e.target.value = ""; // Reset the input so they can pick again
//         return;
//       }

//       setPreviewFile(file);
//       setPreviewUrl(URL.createObjectURL(file));
//       setPreviewSource("upload");
//       e.target.value = "";
//     }
//   };

//   const handleRetake = () => {
//     setPreviewFile(null);
//     setPreviewUrl(null);
//     if (previewSource === "camera") setIsCameraOpen(true);
//     else handleFileUploadClick();
//   };

//   const handleAcceptImage = async () => {
//     // setIsUploading(true);
//     try {
//       const documentNumberString = String(invoice?.docNum);
//       const tempResponse = await uploadService.uploadProofToTemp(
//         previewFile,
//         documentNumberString,
//       );
//       setUploadedImages((prev) => [...prev, tempResponse]);
//       setPreviewFile(null);
//       setPreviewUrl(null);
//       setPreviewSource(null);
//     } catch (err) {
//       alert("Failed to upload image. Please try again.");
//     } 
//     // finally {
//     //   setIsUploading(false);
//     // }
//   };

//   const handleRemoveImage = async (indexToRemove, e) => {
//     if (e) e.stopPropagation(); // Prevents click from opening carousel

//     const imgObj = uploadedImages[indexToRemove];
//     const targetFileName = imgObj.fileName || imgObj.FileName;

//     try {
//       await uploadService.deleteTempProof(
//         String(invoice?.docNum),
//         targetFileName,
//       );
//       setUploadedImages((prev) => prev.filter((_, i) => i !== indexToRemove));
//     } catch (err) {
//       console.error("Failed to delete temp file", err);
//       alert("Failed to remove image from server.");
//     }
//   };

//   const isValid = vehicle.trim().length > 0 && uploadedImages.length > 0;

//   return (
//     <div className="flex flex-col h-full w-full relative">
//       <input
//         type="file"
//         accept="image/*"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         className="hidden"
//       />

//       {/* 1. DATA GRID */}
//       <div className="shrink-0 bg-white/5 border border-white/10 rounded-2xl p-3 mb-3">
//         <div className="mb-3 pb-2 border-b border-white/5">
//           <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-0.5">
//             {t("verify.customer")}
//           </p>
//           <p className="text-sm font-bold text-white truncate">
//             {invoice?.cardName || "Unknown"}
//           </p>
//         </div>
//         <div className="grid grid-cols-2 gap-y-3 gap-x-2">
//           <div>
//             <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-0.5">
//               {t("verify.docType")}
//             </p>
//             <p className="text-xs font-semibold text-gray-200">
//               {getDocTypeName(invoice?.docType)}
//             </p>
//           </div>
//           <div>
//             <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-0.5">
//               {t("verify.docNumber")}
//             </p>
//             <p className="text-xs font-mono font-bold text-primary">
//               {invoice?.docNum}
//             </p>
//           </div>
//           <div>
//             <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-0.5">
//               {t("verify.quantity")}
//             </p>
//             <p className="text-xs font-bold text-gray-200">
//               {invoice?.quantity || 0} {t("verify.units")}
//             </p>
//           </div>
//           <div>
//             <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-0.5">
//               {t("verify.outstanding")}
//             </p>
//             <p className="text-xs font-bold text-amber-400">
//               {formatCurrency(invoice?.docTotal)}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* 2. INPUT FORM */}
//       <div className="shrink-0 space-y-3">
//         <div>
//           <label className="text-[10px] text-muted uppercase tracking-widest font-bold mb-1 block ml-1">
//             {t("verify.vehicleNumber")} <span className="text-red-400">*</span>
//           </label>
//           <input
//             type="text"
//             value={vehicle}
//             onChange={(e) => setVehicle(e.target.value.toUpperCase())}
//             placeholder="e.g. TN0004"
//             className="w-full px-3 py-2.5 text-sm rounded-xl border border-white/10 bg-black/40 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium uppercase transition-all placeholder:text-white/20 placeholder:normal-case"
//           />
//         </div>

//         <div>
//           <label className="text-[10px] text-muted uppercase tracking-widest font-bold mb-1 block ml-1">
//             {t("verify.remarks")}
//           </label>
//           <input
//             type="text"
//             value={remarks}
//             onChange={(e) => setRemarks(e.target.value)}
//             placeholder={t("verify.remarksPlaceholder")}
//             className="w-full px-3 py-2.5 text-sm rounded-xl border border-white/10 bg-black/40 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
//           />
//         </div>

//         {/* THUMBNAILS & CONTROLS */}
//         <div>
//           <label className="text-[10px] text-muted uppercase tracking-widest font-bold mb-2 block ml-1">
//             {t("verify.deliveryProof")} <span className="text-red-400">*</span>
//           </label>
//           <div className="flex items-center gap-4">
//             {uploadedImages.map((img, index) => (
//               // 🚀 UPDATED: Removed overflow-hidden so the tiny top-right badge shows outside the box
//               <div key={index} className="relative w-[50px] h-[50px] shrink-0">
//                 {/* The Thumbnail Image */}
//                 <img
//                   src={img.publicUrl || img.PublicUrl}
//                   alt="Proof"
//                   onClick={() => setCarouselIndex(index)}
//                   className="w-full h-full object-cover rounded-lg border border-white/20 shadow-md cursor-pointer active:scale-95 transition-transform"
//                 />

//                 {/* 🚀 NEW: Tiny Red X Badge (Top Right) */}
//                 <button
//                   onClick={(e) => handleRemoveImage(index, e)}
//                   className="absolute -top-2 -right-2 w-[22px] h-[22px] bg-red-500 text-white flex items-center justify-center rounded-full shadow-[0_2px_10px_rgba(239,68,68,0.5)] text-[10px] border-2 border-background active:scale-90 transition-transform"
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}

//             {uploadedImages.length < 2 && (
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setIsCameraOpen(true)}
//                   className="w-[50px] h-[50px] flex items-center justify-center rounded-lg border-2 border-dashed border-primary/50 text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
//                 >
//                   <svg
//                     width="20"
//                     height="20"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   >
//                     <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
//                     <circle cx="12" cy="13" r="4"></circle>
//                   </svg>
//                 </button>
//                 <button
//                   onClick={handleFileUploadClick}
//                   className="w-[50px] h-[50px] flex items-center justify-center rounded-lg border-2 border-dashed border-sky-500/50 text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 transition-colors"
//                 >
//                   <svg
//                     width="20"
//                     height="20"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//                     <polyline points="17 8 12 3 7 8"></polyline>
//                     <line x1="12" y1="3" x2="12" y2="15"></line>
//                   </svg>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 3. BOTTOM FIXED BUTTON */}
//       <div className="mt-auto shrink-0 pt-3">
//         <button
//           onClick={() =>
//             onConfirm({ vehicle, remarks, images: uploadedImages })
//           }
//           disabled={!isValid}
//           className="btn-primary w-full py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
//         >
//           {t("verify.postDelivery")}
//         </button>
//       </div>

//       {/* 🔴 LIVE CAMERA MODAL */}
//       {isCameraOpen && (
//         <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in">
//           <div className="flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 inset-x-0 z-10">
//             <span className="text-white font-bold tracking-wide">
//              {t("proof.capture")}
//             </span>
//             <button
//               onClick={() => setIsCameraOpen(false)}
//               className="text-white text-sm font-medium px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors"
//             >
//               {t("proof.cancel")}
//             </button>
//           </div>
//           <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-10 border-2 border-white/20 rounded-2xl pointer-events-none border-dashed shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"></div>
//           </div>
//           <div className="h-32 bg-black flex items-center justify-center pb-8 shrink-0">
//             <button
//               onClick={takePhoto}
//               className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]"
//             >
//               <div className="w-12 h-12 bg-white rounded-full active:scale-90 transition-transform"></div>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 🟢 RETAKE MODAL */}
//       {previewUrl && (
//         <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-fade-in">
//           <p className="text-white font-bold mb-4">{t("proof.confirmImage")}</p>
//           <img
//             src={previewUrl}
//             alt="Preview"
//             className="max-h-[60vh] max-w-full rounded-2xl border border-white/20 mb-8 object-contain shadow-2xl"
//           />
//           {/* {isUploading ? (
//             <div className="py-4">
//               <Spinner label="Saving Image..." />
//             </div>
//           ) : ( */}
//             <div className="flex gap-4 w-full max-w-xs">
//               <button
//                 onClick={handleRetake}
//                 className="flex-1 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
//               >
//                 {t("proof.retake")}
//               </button>
//               <button
//                 onClick={handleAcceptImage}
//                 className="flex-1 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30"
//               >
//                 {t("proof.looksGood")}
//               </button>
//             </div>
//           {/* )} */}
//         </div>
//       )}

//       {/* 🔵 IMAGE CAROUSEL MODAL (Full Screen View) */}
//       {carouselIndex !== null && (
//         <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex flex-col animate-fade-in">
//           {/* Top Navbar */}
//           <div className="flex justify-between items-center p-4 absolute top-0 inset-x-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
//             <span className="text-white font-medium text-sm">
//               {carouselIndex + 1} / {uploadedImages.length}
//             </span>

//             <div className="flex items-center gap-4">
//               {/* 🚀 NEW: Trash Button inside Full Screen */}
//               <button
//                 onClick={(e) => {
//                   handleRemoveImage(carouselIndex, e);
//                   setCarouselIndex(null); // Close the view after deleting
//                 }}
//                 className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
//               >
//                 <svg
//                   width="14"
//                   height="14"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <polyline points="3 6 5 6 21 6"></polyline>
//                   <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
//                 </svg>
//               </button>

//               {/* Close Button */}
//               <button
//                 onClick={() => setCarouselIndex(null)}
//                 className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
//               >
//                 ✕
//               </button>
//             </div>
//           </div>

//           <div className="flex-1 flex items-center justify-center p-4">
//             <img
//               src={
//                 uploadedImages[carouselIndex]?.publicUrl ||
//                 uploadedImages[carouselIndex]?.PublicUrl
//               }
//               className="max-w-full max-h-[80vh] rounded-xl shadow-2xl object-contain"
//             />
//           </div>

//           {uploadedImages.length > 1 && (
//             <div className="h-20 flex justify-center items-center gap-8 shrink-0 pb-4">
//               <button
//                 onClick={() =>
//                   setCarouselIndex(
//                     carouselIndex === 0
//                       ? uploadedImages.length - 1
//                       : carouselIndex - 1,
//                   )
//                 }
//                 className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10"
//               >
//                 ←
//               </button>
//               <button
//                 onClick={() =>
//                   setCarouselIndex(
//                     carouselIndex === uploadedImages.length - 1
//                       ? 0
//                       : carouselIndex + 1,
//                   )
//                 }
//                 className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10"
//               >
//                 →
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
