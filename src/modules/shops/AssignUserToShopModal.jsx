import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function AssignManagerModal({ shop, close, refresh }) {

  const [users,setUsers] = useState([]);
  const [selected,setSelected] = useState([]);

  useEffect(()=>{

    const load = async () => {

      const usersRes = await axiosClient.get("/users");
      console.log("users: ", usersRes.data);
      const assignedRes = await axiosClient.get(`/shops/${shop.id}/users`);
      console.log("assigned: ", assignedRes.data);


      setUsers(usersRes.data);

      setSelected(
        assignedRes.data.map(u => u.userId)
      );
    };

    load();

  },[shop.id]);

  const toggleUser = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const save = async () => {
    try{
      await axiosClient.post(`/shops/${shop.id}/users`,{
        userIds: selected
      });
      refresh();
      close();
    }catch(err){
      alert("Failed to assign managers");
    }
  };

  return(

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded w-[400px] space-y-4">

        <h2 className="text-lg font-semibold">
          Assign Managers - {shop.name}
        </h2>

        <div className="max-h-60 overflow-y-auto space-y-2">

          {users.map(user => (

            <label
              key={user.id}
              className="flex items-center gap-2 border p-2 rounded"
            >

              <input
                type="checkbox"
                checked={selected.includes(user.id)}
                onChange={()=>toggleUser(user.id)}
              />

              <span>{user.name}</span>

            </label>

          ))}

        </div>

        <div className="flex justify-end gap-2">

          <button onClick={close}>Cancel</button>

          <button
            onClick={save}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}