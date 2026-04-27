import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useShop } from "../../context/ShopContext";
import ReceiptModal from "./ReceiptModal";

export default function SalesHistoryPage() {
  const { activeShop } = useShop();
  const [sales, setSales] = useState([]);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activeShop) return;

    const fetchSales = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axiosClient.get(`/sales?shopId=${activeShop.id}`);
        // Check if response is an array or has a data property
        const salesData = Array.isArray(res.data) ? res.data : res.data?.sales || [];
        setSales(salesData);
      } catch (err) {
        console.error("Error fetching sales:", err);
        setError(err.response?.data?.message || "Failed to load sales history");
        setSales([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [activeShop]);

  if (!activeShop) {
    return <div className="p-4 text-gray-500">Please select a shop first</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sales History</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && sales.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
          No sales found. Complete a sale to see it here.
        </div>
      )}

      {!loading && sales.length > 0 && (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Shop</th>
                  <th className="p-3 text-left">Cashier</th>
                  <th className="p-3 text-left">Payment Method</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 text-sm">
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3">{sale.shop?.name || "N/A"}</td>
                    <td className="p-3">{sale.cashier?.name || "N/A"}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {sale.paymentType}
                      </span>
                    </td>
                    <td className="p-3 text-right font-semibold">
                      ₦{sale.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedSaleId(sale.id)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm"
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
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-gray-500 font-medium">
                    {new Date(sale.createdAt).toLocaleString()}
                  </p>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {sale.paymentType}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">
                    {sale.cashier?.name || "Cashier"}
                  </span>
                  <span className="font-bold text-lg">
                    ₦{sale.totalAmount.toFixed(2)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  Shop: {sale.shop?.name || "N/A"}
                </p>

                <button
                  onClick={() => setSelectedSaleId(sale.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition"
                >
                  Reprint Receipt
                </button>
              </div>
            ))}
          </div>
        </>
      )}

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
