import { useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function EditUserModal({ category, close, refresh }) {

  const [form, setForm] = useState({
    name: category.name
  });

  const updateCategory = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.put(`/category/${category.id}`, form);
      alert("Category updated successfully.");
      refresh();
      close();
    } catch (err) {
      alert("Failed to update category");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-lg p-6 w-96 space-y-4">

        <h2 className="text-lg font-semibold">Edit Category</h2>

        <form onSubmit={updateCategory} className="space-y-3">

          <input
            value={form.name}
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

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
              Save
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
