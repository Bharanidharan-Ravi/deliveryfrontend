import { useState } from "react";

export default function ManualEntryForm({ onSubmit, loading }) {
  // We use "1" for Invoice and "2" for Delivery to match the docType integer logic
  const [documentType, setDocumentType] = useState("13"); 
  const [value, setValue] = useState("");

  // STRICT NUMBER VALIDATOR
  const handleNumberInput = (e) => {
    const val = e.target.value;
    // Only allows empty string or numbers (0-9)
    if (val === "" || /^[0-9]+$/.test(val)) {
      setValue(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    
    // Pass docNum (string) and docType (integer) back to DeliveryPage
    onSubmit(value.trim(), parseInt(documentType, 10));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-6">
      
      {/* Document Type Dropdown */}
      <div>
        <label className="text-[11px] text-muted uppercase tracking-widest font-bold mb-2 block ml-1">
          Document Type
        </label>
        <div className="relative">
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full p-4 rounded-2xl border border-white/10 bg-black/40 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none font-medium transition-all"
          >
            <option value="13">Invoice</option>
            <option value="15">Delivery</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted">
            ▼
          </div>
        </div>
      </div>

      {/* Document Number Input */}
      <div>
        <label className="text-[11px] text-muted uppercase tracking-widest font-bold mb-2 block ml-1">
          Document Number
        </label>
        <input
          type="text"              // Keeps it as text so UI arrows don't appear
          inputMode="numeric"      // Forces mobile phones to open the Number Pad
          className="w-full p-4 rounded-2xl border border-white/10 bg-black/40 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium tracking-wide transition-all placeholder:text-white/20"
          placeholder="e.g. 26009707"
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
            Verifying...
          </span>
        ) : (
          "Verify Document"
        )}
      </button>
    </form>
  );
}