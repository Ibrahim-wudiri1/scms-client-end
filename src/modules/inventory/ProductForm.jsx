import { useState, useEffect } from "react";
import {useShop} from "../../context/ShopContext";

export default function ProductForm({ product, onSave, onClose }) {
  const {activeShop} = useShop();
  const [form, setForm] = useState({
    shopId: activeShop.id,
    name: "",
    sku: "",
    costPrice: "",
    sellingPrice: "",
    quantity: "",
    category: "",
  });

  useEffect(() => {
    if (product) {
      setForm({...product, shopId: product.shopId,});
    }
  }, [product]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
       onSave({
      ...form,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      quantity: Number(form.quantity),
    });
    } catch (error) {
      alert(error?.data?.message || "server fail");
    }
   
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {product ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-3">
          {["name", "sku", "category", "costPrice", "sellingPrice", "quantity"].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={form[field] || ""}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          ))}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {product ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
