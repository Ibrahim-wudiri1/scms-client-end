import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import UsersTable from "./UsersTable";
import CreateUserModal from "./CreateUserModal";

export default function UsersPage() {

  const [users,setUsers] = useState([]);
  const [loading,setLoading] = useState(true);
  const [showCreate,setShowCreate] = useState(false);
  const [search,setSearch] = useState("");

  const loadUsers = async () => {
    try{
      const res = await axiosClient.get("/users");
      setUsers(res.data);
    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    loadUsers();
  },[]);

  const filteredUsers = users.filter((u)=>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if(loading) return <div className="p-6">Loading users...</div>;

  return(

    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">Users</h1>

        <button
        onClick={()=>setShowCreate(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add User
        </button>

      </div>

      {/* Search */}

      <input
      type="text"
      placeholder="Search user..."
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      className="border p-2 rounded w-64"
      />

      <UsersTable users={filteredUsers} refresh={loadUsers}/>

      {showCreate && (
        <CreateUserModal
        close={()=>setShowCreate(false)}
        refresh={loadUsers}
        />
      )}

    </div>
  );
}
