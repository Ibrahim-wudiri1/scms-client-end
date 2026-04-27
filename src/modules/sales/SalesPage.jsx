import { useState } from "react";
import ProductSearch from "./ProductSearch";
import CartPanel from "./CartPanel";
import axiosClient from "../../api/axiosClient";
import { useShop } from "../../context/ShopContext";
import ReceiptModal from "./ReceiptModal";

export default function SalesPage() {
  const [cart, setCart] = useState([]);
  const {activeShop} = useShop();
  const [processing, setProcessing] = useState(false);
  const [receiptSaleId, setReceiptSaleId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentType, setPaymentType] = useState("CASH");
  const addProduct = (product) => {
    const exists = cart.find((i) => i.id === product.id);
    if (exists) {
      setCart(
        cart.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1, price: product.sellingPrice }]);
    }
  };

  const handleQtyChange = (id, quantity) => {
    if(quantity < 1) {
      handleRemove(id);
      return;
    };

    setCart(cart.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const handleRemove = (id) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  const handleCheckout = async (total) => {
    if (!activeShop?.id) {
      setErrorMessage("No shop selected. Please select a shop first.");
      return;
    }

    if (cart.length === 0) {
      setErrorMessage("Cart is empty. Add items before completing sale.");
      return;
    }

    const saleData = {
      shopId: activeShop?.id,
      items: cart.map((c) => ({
        productId: c.id,
        quantity: c.quantity,
        price: c.price,
      })),
      paymentType: paymentType,
    };

    try {
      setProcessing(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await axiosClient.post("/sales", saleData);

      if (!res.data?.saleId) {
        throw new Error("Invalid response from server. Sale ID not found.");
      }

      setReceiptSaleId(res.data.saleId);
      setSuccessMessage("Sale completed successfully! Receipt will open shortly.");
      setCart([]);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      console.error("Error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to complete sale. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-4 h-[calc(100vh-80px)]">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="col-span-12 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="col-span-12 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      {/* Left side: Search and Product quick add */}
      <div className="col-span-8 bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold mb-4">Point of Sale</h1>
        <ProductSearch onAdd={addProduct} />
        <div className="mt-3">
          {cart.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">Product</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Total</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{item.name}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">₦{item.price.toFixed(2)}</td>
                    <td className="p-2 text-right font-semibold">₦{(item.quantity * item.price).toFixed(2)}</td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-bold"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-10">Start adding products to cart</p>
          )}
        </div>
      </div>

      {/* Right side: Cart summary */}
      <div className="col-span-4 h-full">
        <CartPanel
          cart={cart}
          onQuantityChange={handleQtyChange}
          onRemove={handleRemove}
          onCheckout={handleCheckout}
          processing={processing}
          shopId={activeShop?.id}
          setPaymentType={setPaymentType}
          paymentType={paymentType}
        />
      </div>

      {receiptSaleId && (
        <ReceiptModal
          saleId={receiptSaleId}
          onClose={() => setReceiptSaleId(null)}
        />
      )}
    </div>
  );
}
