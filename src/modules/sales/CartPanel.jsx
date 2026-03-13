import "../../styles/colors.css";

export default function CartPanel({ cart, onQuantityChange, onRemove, onCheckout, processing, shopId, setPaymentType, paymentType }) {
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
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                    className="px-2 border rounded"
                  >
                    -
                  </button>

                  <span className="w-6 text-center">{item.quantity}</span>

                  <button
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                    className="px-2 border rounded"
                  >
                    +
                  </button>
                </div>
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
          <div className="mt-3">
            <label className="text-sm font-medium">Payment Method</label>

            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="border rounded w-full p-2 mt-1"
            >
              <option value="CASH">Cash</option>
              <option value="POS">POS</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>

       <button
          onClick={() => onCheckout(total)}
          disabled={cart.length === 0 || processing}
          className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-3 rounded text-lg font-semibold"
        >
          {processing ? "Processing..." : "Complete Sale"}
        </button>
      </div>
    </div>
  );
}
