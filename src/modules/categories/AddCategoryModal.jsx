import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

export default function CreateCategoryModal({ close, refresh }) {

  const [form, setForm] = useState({
    name: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.post("/category", { ...form});
      alert("Category created successfully.");
      refresh();
      close();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
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
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

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

        </form>

      </div>

    </div>
  );
}
