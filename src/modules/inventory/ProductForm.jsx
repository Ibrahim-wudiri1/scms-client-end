import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";   // ← Import your axios instance
import { useShop } from "../../context/ShopContext";

export default function ProductForm({ product, onSave, onClose }) {
  const { activeShop } = useShop();

  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [loadingShops, setLoadingShops] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [form, setForm] = useState({
    shopId: selectedShopId || "",
    name: "",
    sku: "",
    costPrice: "",
    sellingPrice: "",
    quantity: "",
    categoryId: "",
  });

  // Populate form when editing an existing product
  useEffect(() => {
    if (product) {
      setForm({
        shopId: product.shopId || activeShop?.id || "",
        name: product.name || "",
        sku: product.sku || "",
        costPrice: product.costPrice || "",
        sellingPrice: product.sellingPrice || "",
        quantity: product.quantity || "",
        categoryId: product.categoryId || "",
      });
    }
  }, [product, activeShop]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
    // fetchShops();
  }, []);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await axiosClient.get("/category");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
      alert("Failed to load categories. Please try again.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchShops = async () => {
    try {
      setLoadingShops(true);
      const res = await axiosClient.get("/shops");
      setShops(res.data || []); // Assuming the response is an array of shops
    } catch (err) {
      console.error("Failed to load shops:", err);
      alert("Failed to load shops. Please try again.");
    } finally {
      setLoadingShops(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.sku || !form.categoryId) {
      alert("Please fill in all required fields");
      return;
    }

    const payload = {
      ...form,
      costPrice: Number(form.costPrice) || 0,
      sellingPrice: Number(form.sellingPrice) || 0,
      quantity: Number(form.quantity) || 0,
    };

    try {
      onSave(payload);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to save product");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {product ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded p-3 w-full focus:outline-none focus:border-blue-500"
            required
          />

          {/* SKU */}
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
            className="border rounded p-3 w-full focus:outline-none focus:border-blue-500"
            required
          />

          {/* Category - Select */}
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="border rounded p-3 w-full focus:outline-none focus:border-blue-500"
            required
            disabled={loadingCategories}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {/* Shop - Select */}
          <select
            name="shopId"
            value={form.shopId}
            onChange={handleChange}
            className="border rounded p-3 w-full focus:outline-none focus:border-blue-500"
            required
            disabled={loadingShops}
          >
            <option value="">Select Shop</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>

          {/* Cost Price */}
          <input
            type="number"
            name="costPrice"
            placeholder="Cost Price"
            value={form.costPrice}
            onChange={handleChange}
            className="border rounded p-3 w-full focus:outline-none focus:border-blue-500"
            required
          />

          {/* Selling Price */}
          <input
            type="number"
            name="sellingPrice"
            placeholder="Selling Price"
            value={form.sellingPrice}
            onChange={handleChange}
            className="border rounded p-3 w-full focus:outline-none focus:border-blue-500"
            required
          />

          {/* Quantity */}
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            className="border rounded p-3 w-full focus:outline-none focus:border-blue-500"
            required
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {product ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}