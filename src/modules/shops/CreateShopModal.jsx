import { useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function CreateShopModal({ close, refresh }) {

  const [form,setForm] = useState({
    name:"",
    location:""
  });

  const submit = async (e) => {
    e.preventDefault();

    try{
      await axiosClient.post("/shops",form);
      refresh();
      close();
    }catch(err){
      alert(err.response?.data?.message);
    }
  };

  return(

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded w-96 space-y-4">

        <h2 className="text-lg font-semibold">Create Shop</h2>

        <form onSubmit={submit} className="space-y-3">

          <input
          placeholder="Shop Name"
          className="w-full border p-2 rounded"
          onChange={(e)=>setForm({...form,name:e.target.value})}
          />

          <input
          placeholder="Location"
          className="w-full border p-2 rounded"
          onChange={(e)=>setForm({...form,location:e.target.value})}
          />

          <div className="flex justify-end gap-2">

            <button type="button" onClick={close}>
              Cancel
            </button>

            <button className="bg-blue-600 text-white px-3 py-2 rounded">
              Create
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}