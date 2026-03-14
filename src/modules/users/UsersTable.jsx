import { useState } from "react";
import EditUserModal from "./EditUserModal";

export default function UsersTable({ users, refresh }) {

  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Role</th>
            <th className="text-left p-3">Created</th>
            <th className="text-right p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">

              <td className="p-3">{user.name}</td>

              <td className="p-3">{user.email}</td>

              <td className="p-3">
                <span className="px-2 py-1 text-xs rounded bg-gray-200">
                  {user.role}
                </span>
              </td>

              <td className="p-3">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>

              <td className="p-3 text-right">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
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
    </div>
  );
}
