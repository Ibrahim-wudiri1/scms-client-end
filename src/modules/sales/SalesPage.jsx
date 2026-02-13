import { useState } from "react";
import ProductSearch from "./ProductSearch";
import CartPanel from "./CartPanel";
import axiosClient from "../../api/axiosClient";
import { useShop } from "../../context/ShopContext";
import ReceiptModal from "./ReceiptModel";

export default function SalesPage() {
  const [cart, setCart] = useState([]);
  const {activeShop} = useShop();
  const [processing, setProcessing] = useState(false);
  const [receiptSaleId, SetReceiptSaleId] = useState(null);
  // const [shops, setShops] = useState([]);
  // const [selectedShopId, setSelectedShopId] = useState("");
  // const [selectedPaymentType, setSelectedPaymentType] = useState("");

  const fecthShops = async () =>{
    const result = await axiosClient.get();
  }
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
    setCart(cart.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const handleRemove = (id) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  const handleCheckout = async (total) => {
    const saleData = {
      shopId: activeShop.id,
      paymentType: "CASH", // for now later we enhance
      items: cart.map((c) => ({
        productId: c.id,
        quantity: c.quantity,
        price: c.price,
      })),
    };
    
    try {
      setProcessing(true);

      const res = await axiosClient.post("/sales", saleData);
      SetReceiptSaleId(res.data.sale.id);
      alert("Sale completed successfully!");
      setCart([]);

    } catch (error) {
      alert(error.response?.data?.message || "Sale failed");
    } finally{
      setProcessing(false);
    }
   
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 p-4">
      {/* Left side: Search and Product quick add */}
      <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
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
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">${item.price}</td>
                    <td className="p-2">${(item.quantity * item.price).toFixed(2)}</td>
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
      <div className="md:col-span-1">
        <CartPanel
          cart={cart}
          onQuantityChange={handleQtyChange}
          onRemove={handleRemove}
          onCheckout={handleCheckout}
          processing={processing}
        />
      </div>

      {receiptSaleId && (
        <ReceiptModal
          saleId={receiptSaleId}
          onClose={() => SetReceiptSaleId(null)}
        />
      )}
    </div>
  );
}
