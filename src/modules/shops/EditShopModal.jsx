import { useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function EditShopModal({ shop, close, refresh }) {

  const [form,setForm] = useState({
    name: shop.name,
    location: shop.location
  });

  const update = async (e) => {
    e.preventDefault();

    try{
      await axiosClient.put(`/shops/${shop.id}`,form);
      refresh();
      close();
    }catch(err){
      alert("Failed to update");
    }
  };

  return(

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded w-96 space-y-4">

        <h2 className="text-lg font-semibold">Edit Shop</h2>

        <form onSubmit={update} className="space-y-3">

          <input
          value={form.name}
          className="w-full border p-2 rounded"
          onChange={(e)=>setForm({...form,name:e.target.value})}
          />

          <input
          value={form.location}
          className="w-full border p-2 rounded"
          onChange={(e)=>setForm({...form,location:e.target.value})}
          />

          <div className="flex justify-end gap-2">

            <button type="button" onClick={close}>
              Cancel
            </button>

            <button className="bg-blue-600 text-white px-3 py-2 rounded">
              Save
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}