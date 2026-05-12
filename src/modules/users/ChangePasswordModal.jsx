import { useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function ChangePasswordModal({ user, close }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!password.trim() || password.length < 6) {
      return alert("Password must be at least 6 characters.");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    setLoading(true);
    try {
      await axiosClient.put(`/users/${user.id}/password`, {
        newPassword: password,
      });
      alert("Password updated successfully.");
      close();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 space-y-4">
        <h2 className="text-lg font-semibold">Change Password</h2>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            placeholder="New password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full border p-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="px-3 py-2 border rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
