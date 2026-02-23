import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useShop } from "../../context/ShopContext";
import ReceiptModal from "./ReceiptModal";

export default function SalesHistoryPage() {
  const { activeShop } = useShop();
  const [sales, setSales] = useState([]);
  const [selectedSaleId, setSelectedSaleId] = useState(null);

  useEffect(() => {
    if (!activeShop) return;

    axiosClient
      .get(`/sales?shopId=${activeShop.id}`)
      .then((res) => setSales(res.data));
  }, [activeShop]);

  if (!activeShop) return null;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sales History</h1>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Shop</th>
              <th className="p-3 text-left">Cashier</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {new Date(sale.createdAt).toLocaleString()}
                </td>
                <td className="p-3">{sale.shop}</td>
                <td className="p-3">{sale.user?.name}</td>
                <td className="p-3">{sale.paymentType}</td>
                <td className="p-3 text-right font-semibold">
                  ${sale.totalAmount.toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setSelectedSaleId(sale.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Reprint
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {sales.map((sale) => (
          <div
            key={sale.id}
            className="bg-white p-4 rounded-lg shadow"
          >
            <p className="text-sm text-gray-500">
              {new Date(sale.createdAt).toLocaleString()}
            </p>

            <div className="flex justify-between mt-2">
              <span className="font-medium">
                {sale.user?.name}
              </span>
              <span className="font-bold">
                ${sale.totalAmount.toFixed(2)}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-1">
              {sale.paymentMethod}
            </p>

            <button
              onClick={() => setSelectedSaleId(sale.id)}
              className="mt-3 w-full border rounded py-2 text-sm"
            >
              Reprint Receipt
            </button>
          </div>
        ))}
      </div>

      {/* RECEIPT MODAL */}
      {selectedSaleId && (
        <ReceiptModal
          saleId={selectedSaleId}
          onClose={() => setSelectedSaleId(null)}
        />
      )}
    </div>
  );
}
