export default function InvoiceDetailsCard({
  invoice,
  onNext,
}) {
  return (
    <div className="space-y-4">
      <div className="card">
        <h2>{invoice.customerName}</h2>

        <p>Item Qty: {invoice.quantity}</p>

        <p>Outstanding: ₹{invoice.balance}</p>

        <p>Location: {invoice.location}</p>
      </div>

      <button
        className="btn-primary w-full"
        onClick={onNext}
      >
        Continue
      </button>
    </div>
  );
}