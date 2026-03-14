import { useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function CreateUserModal({ close, refresh }) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CASHIER"
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.post("/users", form);
      refresh();
      close();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-lg p-6 w-96 space-y-4">

        <h2 className="text-lg font-semibold">Create User</h2>

        <form onSubmit={submit} className="space-y-3">

          <input
            type="text"
            placeholder="Name"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <select
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="CASHIER">Cashier</option>
            <option value="MANAGER">Manager</option>
            <option value="TENANT_ADMIN">Admin</option>
          </select>

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
