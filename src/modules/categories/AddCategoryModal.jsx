import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { useShop } from "../../context/ShopContext";

export default function CreateCategoryModal({ close, refresh }) {
  const { shops, activeShop } = useShop();

  const [form, setForm] = useState({
    name: "",
    shopId: "",
  });

  useEffect(() => {
    if (activeShop) {
      setForm((prev) => ({ ...prev, shopId: activeShop.id }));
    }
  }, [activeShop]);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return alert("Please enter a category name.");
    }

    if (!form.shopId) {
      return alert("Please select a shop.");
    }

    try {
      await axiosClient.post(`/shops/${form.shopId}/categories`, {
        name: form.name.trim(),
      });
      alert("Category created successfully.");
      refresh();
      close();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating category");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 space-y-4">
        <h2 className="text-lg font-semibold">Create Category</h2>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="text"
            placeholder="Category Name"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop
            </label>
            <select
              className="w-full border p-2 rounded"
              value={form.shopId}
              onChange={(e) => setForm({ ...form, shopId: e.target.value })}
            >
              <option value="">Select Shop</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="px-3 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
