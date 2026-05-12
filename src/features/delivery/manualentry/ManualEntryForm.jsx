import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ManualEntryForm({ onSubmit, loading }) {
  const { t } = useTranslation();
  const [documentType, setDocumentType] = useState("13"); 
  const [value, setValue] = useState("");

  const handleNumberInput = (e) => {
    const val = e.target.value;
    if (val === "" || /^[0-9]+$/.test(val)) {
      setValue(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim(), parseInt(documentType, 10));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-6">
      
      {/* Document Type Dropdown */}
      <div>
        <label className="text-[11px] text-muted uppercase tracking-widest font-bold mb-2 block ml-1">
          {t("manualEntry.docType")}
        </label>
        <div className="relative">
          {/* 🚀 FIXED: Replaced bg-black/40 text-white with dynamic theme variables */}
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full p-4 rounded-2xl border border-border/20 bg-card shadow-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none font-bold transition-all"
          >
            <option value="13">{t("manualEntry.invoice")}</option>
            <option value="15">{t("manualEntry.delivery")}</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted">
            ▼
          </div>
        </div>
      </div>

      {/* Document Number Input */}
      <div>
        <label className="text-[11px] text-muted uppercase tracking-widest font-bold mb-2 block ml-1">
         {t("manualEntry.docNumber")}
        </label>
        {/* 🚀 FIXED: Replaced bg-black/40 text-white with dynamic theme variables */}
        <input
          type="text"              
          inputMode="numeric"      
          className="w-full p-4 rounded-2xl border border-border/20 bg-card shadow-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none font-bold tracking-wide transition-all placeholder:text-muted/50"
          placeholder={t("manualEntry.placeholder")}
          value={value}
          onChange={handleNumberInput}
        />
      </div>

      <button 
        type="submit" 
        disabled={!value.trim() || loading}
        className="btn-primary w-full py-4 rounded-2xl font-bold mt-4 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
             {t("manualEntry.verifyBtn")}...
          </span>
        ) : (
          t("manualEntry.verifyBtn")
        )}
      </button>
    </form>
  );
}



// import { useState } from "react";
// import { useTranslation } from "react-i18next";

// export default function ManualEntryForm({ onSubmit, loading }) {
//   const { t } = useTranslation();
//   // We use "1" for Invoice and "2" for Delivery to match the docType integer logic
//   const [documentType, setDocumentType] = useState("13"); 
//   const [value, setValue] = useState("");

//   // STRICT NUMBER VALIDATOR
//   const handleNumberInput = (e) => {
//     const val = e.target.value;
//     // Only allows empty string or numbers (0-9)
//     if (val === "" || /^[0-9]+$/.test(val)) {
//       setValue(val);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!value.trim()) return;
    
//     // Pass docNum (string) and docType (integer) back to DeliveryPage
//     onSubmit(value.trim(), parseInt(documentType, 10));
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-5 mt-6">
      
//       {/* Document Type Dropdown */}
//       <div>
//         <label className="text-[11px] text-muted uppercase tracking-widest font-bold mb-2 block ml-1">
//           {t("manualEntry.docType")}
//         </label>
//         <div className="relative">
//           <select
//             value={documentType}
//             onChange={(e) => setDocumentType(e.target.value)}
//             className="w-full p-4 rounded-2xl border border-white/10 bg-black/40 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none font-medium transition-all"
//           >
//             <option value="13">{t("manualEntry.invoice")}</option>
//             <option value="15">{t("manualEntry.delivery")}</option>
//           </select>
//           <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted">
//             ▼
//           </div>
//         </div>
//       </div>

//       {/* Document Number Input */}
//       <div>
//         <label className="text-[11px] text-muted uppercase tracking-widest font-bold mb-2 block ml-1">
//          {t("manualEntry.docNumber")}
//         </label>
//         <input
//           type="text"              // Keeps it as text so UI arrows don't appear
//           inputMode="numeric"      // Forces mobile phones to open the Number Pad
//           className="w-full p-4 rounded-2xl border border-white/10 bg-black/40 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium tracking-wide transition-all placeholder:text-white/20"
//           placeholder={t("manualEntry.placeholder")}
//           value={value}
//           onChange={handleNumberInput}
//         />
//       </div>

//       <button 
//         type="submit" 
//         disabled={!value.trim() || loading}
//         className="btn-primary w-full py-4 rounded-2xl font-bold mt-4 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
//       >
//         {loading ? (
//           <span className="flex items-center gap-2">
//             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//              t("manualEntry.verifyBtn")...
//           </span>
//         ) : (
//           t("manualEntry.verifyBtn")
//         )}
//       </button>
//     </form>
//   );
// }