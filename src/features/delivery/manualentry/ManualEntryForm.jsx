import { useState } from "react";

export default function ManualEntryForm({ onSubmit }) {
  const [documentType, setDocumentType] =
    useState("Invoice");

  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!value.trim()) return;

    onSubmit({
      documentType,
      value,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 mt-6"
    >
      <select
        value={documentType}
        onChange={(e) =>
          setDocumentType(e.target.value)
        }
        className="input"
      >
        <option>Invoice</option>
        <option>Delivery</option>
      </select>

      <input
        className="input"
        placeholder="Enter document number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button className="btn-primary w-full">
        Continue
      </button>
    </form>
  );
}