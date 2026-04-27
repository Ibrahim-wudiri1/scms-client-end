import { useState } from "react";
import EditUserModal from "./EditUserModal";

export default function UsersTable({ users, refresh }) {

  const [selectedUser, setSelectedUser] = useState(null);

  const roleBadge = (role) => {

  if(role === "TENANT_ADMIN")
    return "bg-purple-100 text-purple-700";

  if(role === "MANAGER")
    return "bg-blue-100 text-blue-700";

  return "bg-gray-100 text-gray-700";
};

    const toggleUser = async (user) => {

        try{

        await axiosClient.put(`/users/${user.id}`,{
        isActive: !user.isActive
        });

        refresh();

        }catch(err){

        alert("Failed to update user");

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
            <th className="text-left p-3">Created</th>
            <th className="text-right p-3">Action</th>
          </tr>
        </thead>

       <tbody>

            {users.map((user)=>(

            <tr key={user.id} className="border-t hover:bg-gray-50">

            <td className="p-3 font-medium">
            {user.name}
            </td>

            <td className="p-3">
            {user.email}
            </td>

            <td className="p-3">

            <span className={`px-2 py-1 text-xs rounded ${roleBadge(user.role)}`}>
            {user.role}
            </span>

            </td>

            <td className="p-3">

            <span className={`px-2 py-1 text-xs rounded 
            ${user.isActive ? "bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>

            <button
                onClick={()=>toggleUser(user)}
                className="text-red-600 hover:underline"
            >

                {user.isActive ? "Disable":"Activate"}

            </button>

            </span>

            </td>

            <td className="p-3 text-right space-x-3">

            <button
            onClick={()=>setSelectedUser(user)}
            className="text-blue-600 hover:underline"
            >
            Edit
            </button>

            <button
            className="text-red-600 hover:underline"
            >
            Disable
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
