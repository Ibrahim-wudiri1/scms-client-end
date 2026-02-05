export default function CartPanel({ cart, onQuantityChange, onRemove, onCheckout, processing }) {
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-3">Cart</h2>
      <div className="flex-1 overflow-y-auto border-t border-b py-2">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No items yet</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-none">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = Math.max(1, Number(e.target.value));
                    onQuantityChange(item.id, val);
                  }}
                  className="border rounded w-14 p-1 text-center"
                />
                <button onClick={() => onRemove(item.id)} className="text-red-500 text-sm">
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 border-t pt-2">
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => onCheckout(total)}
          disabled={cart.length === 0 || processing}
          className="btn-primary w-full mt-3"
        >
          Complete Sale
        </button>
      </div>
    </div>
  );
}
