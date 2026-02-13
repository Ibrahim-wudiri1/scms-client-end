import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "./receipt.css";

export default function ReceiptModal({ saleId, onClose }) {
  const [sale, setSale] = useState(null);

  useEffect(() => {
    if (!saleId) return;

    axiosClient.get(`/sales/${saleId}`).then((res) => {
      setSale(res.data);
    });
  }, [saleId]);

  if (!sale) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="receipt-container bg-white">
        {/* HEADER */}
        <div className="text-center mb-2">
          <h2 className="font-bold text-lg">{sale.tenant.name}</h2>
          <p className="text-sm">{sale.shop.name}</p>
          <p className="text-xs">
            {new Date(sale.createdAt).toLocaleString()}
          </p>
        </div>

        <hr />

        {/* ITEMS */}
        <table className="w-full text-sm mt-2">
          <thead>
            <tr>
              <th className="text-left">Item</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Amt</th>
            </tr>
          </thead>
          <tbody>
            {sale.saleItems.map((item) => (
              <tr key={item.id}>
                <td>{item.product.name}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-right">
                  {(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className="my-2" />

        {/* TOTAL */}
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${sale.totalAmount.toFixed(2)}</span>
        </div>

        <p className="text-xs mt-2 text-center">
          Payment: {sale.paymentMethod}
        </p>

        <p className="text-xs mt-1 text-center">
          Served by: {sale.user.name}
        </p>

        <p className="text-center text-xs mt-3">
          Thank you for your purchase!
        </p>

        {/* ACTIONS (NOT PRINTED) */}
        <div className="receipt-actions mt-4 flex gap-2">
          <button
            onClick={() => window.print()}
            className="btn-primary w-full"
          >
            Print
          </button>
          <button
            onClick={onClose}
            className="w-full border rounded py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
