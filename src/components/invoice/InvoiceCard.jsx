export function InvoiceCard({ invoice, onConfirm, onRescan }) {
  const { orderNumber, quantity, totalPrice, customerBalance } = invoice;

  const fields = [
    { id: 'inv-order',   label: 'Order Number',       value: orderNumber,                    icon: '🧾' },
    { id: 'inv-qty',     label: 'Quantity',            value: quantity,                       icon: '📦' },
    { id: 'inv-price',   label: 'Total Price',         value: `$${Number(totalPrice).toFixed(2)}`,  icon: '💰' },
    { id: 'inv-balance', label: 'Customer Balance',    value: `$${Number(customerBalance).toFixed(2)}`, icon: '⚖️' },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Card */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-primary text-lg">📋</span>
          <h3 className="font-semibold text-white text-sm">Invoice Details</h3>
        </div>
        <div className="space-y-3">
          {fields.map(({ id, label, value, icon }) => (
            <div key={id} id={id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-2 text-muted text-sm">
                <span>{icon}</span>
                <span>{label}</span>
              </div>
              <span className="text-white font-medium text-sm">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button id="invoice-rescan-btn" onClick={onRescan} className="flex-1 btn-secondary">
          Re-scan
        </button>
        <button id="invoice-confirm-btn" onClick={onConfirm} className="flex-1 btn-primary">
          Confirm Delivery
        </button>
      </div>
    </div>
  );
}
