import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import EditUserModal from "./EditUserModal";
import ChangePasswordModal from "./ChangePasswordModal";

export default function UsersTable({ users, refresh }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const roleBadge = (role) => {
    if (role === "TENANT_ADMIN") return "bg-purple-100 text-purple-700";
    if (role === "MANAGER") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  const toggleUser = async (user) => {
    try {
      await axiosClient.put(`/users/${user.id}`, {
        isActive: !user.isActive,
      });
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  const deleteUser = async (user) => {
    const confirmed = window.confirm(
      `Delete ${user.name}? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await axiosClient.delete(`/users/${user.id}`);
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Role</th>
            <th className="text-left p-3">Shop</th>
            <th className="text-left p-3">Status</th>
            <th className="text-right p-3">Action</th>
          </tr>
        </thead>

       <tbody>

            {users.map((user)=>(

            <tr key={user.id} className="border-t hover:bg-gray-50">

            <td className="p-3 font-medium">{user.name}</td>
            <td className="p-3">{user.email}</td>
            <td className="p-3">
              <span className={`px-2 py-1 text-xs rounded ${roleBadge(user.role)}`}>
                {user.role}
              </span>
            </td>
            <td className="p-3">
              {user.shops?.length > 0
                ? user.shops.map((shop) => shop.name).join(", ")
                : "Unassigned"}
            </td>
            <td className="p-3">
              <span
                className={`px-2 py-1 text-xs rounded ${
                  user.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.isActive ? "Active" : "Disabled"}
              </span>
            </td>
            <td className="p-3 text-right relative">
              <button
                onClick={() =>
                  setOpenMenuId(openMenuId === user.id ? null : user.id)
                }
                className="inline-flex items-center justify-center w-8 h-8 rounded-full border text-gray-600 hover:bg-gray-100"
              >
                ⋮
              </button>

              {openMenuId === user.id && (
                <div className="absolute right-10 top-0 mt-0 w-44 bg-white border rounded shadow-lg z-50">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setOpenMenuId(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setPasswordUser(user);
                      setOpenMenuId(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => {
                      toggleUser(user);
                      setOpenMenuId(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {user.isActive ? "Disable" : "Activate"}
                  </button>
                  <button
                    onClick={() => {
                      deleteUser(user);
                      setOpenMenuId(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </td>

            </tr>

            ))}

            </tbody>


      </table>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          close={() => setSelectedUser(null)}
          refresh={refresh}
        />
      )}
      {passwordUser && (
        <ChangePasswordModal
          user={passwordUser}
          close={() => setPasswordUser(null)}
        />
      )}
    </div>
  );
}
