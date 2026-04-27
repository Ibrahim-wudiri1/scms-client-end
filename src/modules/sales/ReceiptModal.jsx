import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "./receipt.css";

export default function ReceiptModal({ saleId, onClose }) {
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!saleId) return;

    const fetchSale = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axiosClient.get(`/sales/${saleId}`);
        setSale(res.data);
      } catch (err) {
        console.error("Error fetching receipt:", err);
        setError(err.response?.data?.message || "Failed to load receipt");
        setSale(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [saleId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading receipt...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p className="text-gray-600 mb-4">Receipt not found</p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const cashierName = sale.cashier?.name || (sale.user?.name || "N/A");

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 print:bg-transparent">
      <div className="receipt-container bg-white">
        {/* HEADER */}
        <div className="text-center mb-2">
          <h2 className="font-bold text-lg">{sale.tenant?.name || "Receipt"}</h2>
          <p className="text-sm">{sale.shop?.name || ""}</p>
          <p className="text-xs text-gray-600">
            {new Date(sale.createdAt).toLocaleString()}
          </p>
        </div>

        <hr className="my-2" />

        {/* ITEMS */}
        <table className="w-full text-sm mt-2">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold">Item</th>
              <th className="text-center text-xs font-semibold">Qty</th>
              <th className="text-right text-xs font-semibold">Amt</th>
            </tr>
          </thead>
          <tbody>
            {sale.items && sale.items.length > 0 ? (
              sale.items.map((item) => (
                <tr key={item.id} className="border-t border-gray-200">
                  <td className="py-1">{item.product?.name || "Unknown Product"}</td>
                  <td className="text-center py-1">{item.quantity}</td>
                  <td className="text-right py-1">
                    ₦{(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-2 text-gray-500">
                  No items
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <hr className="my-2" />

        {/* TOTAL */}
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₦{sale.totalAmount.toFixed(2)}</span>
        </div>

        {/* PAYMENT INFO */}
        <div className="text-xs mt-3 text-center text-gray-600">
          <p className="font-medium">Payment Method: {sale.paymentType}</p>
          <p className="mt-1">Served by: {cashierName}</p>
        </div>

        <p className="text-center text-xs mt-3 italic text-gray-700">
          Thank you for your purchase!
        </p>

        {/* ACTIONS (NOT PRINTED) */}
        <div className="receipt-actions mt-4 flex gap-2">
          <button
            onClick={() => window.print()}
            className="btn-primary flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium transition"
          >
            🖨️ Print
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 rounded py-2 hover:bg-gray-50 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
