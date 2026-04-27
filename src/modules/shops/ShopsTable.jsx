import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import EditShopModal from "./EditShopModal";
import AssignManagerModal from "./AssignUserToShopModal";

export default function ShopsTable({ shops, refresh }) {

  const [selected,setSelected] = useState(null);
  const [assigning,setAssigning] = useState(null);

  const deleteShop = async (id) => {
    if(!confirm("Delete this shop?")) return;

    try{
      await axiosClient.delete(`/shops/${id}`);
      refresh();
    }catch(err){
      alert("Failed to delete shop");
    }
  };

  return(

    <div className="bg-white shadow rounded-lg overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Managers</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>

        {shops.map((shop)=>(

          <tr key={shop.id} className="border-t hover:bg-gray-50">

            <td className="p-3 font-medium">{shop.name}</td>

            <td className="p-3">{shop.location}</td>

            <td className="p-3">
              {shop.userShops?.length || 0} Managers
            </td>

            <td className="p-3 text-right space-x-3">
              <button
              onClick={()=>setAssigning(shop)}
              className="text-green-600"
              >
                Assign Users
              </button>
              <button
              onClick={()=>setSelected(shop)}
              className="text-blue-600"
              >
                Edit
              </button>

              <button
              onClick={()=>deleteShop(shop.id)}
              className="text-red-600"
              >
                Delete
              </button>

            </td>

          </tr>

        ))}

        </tbody>

      </table>

      {selected && (
        <EditShopModal
        shop={selected}
        close={()=>setSelected(null)}
        refresh={refresh}
        />
      )}

      {assigning && (
        <AssignManagerModal
        shop={assigning}
        close={()=>setAssigning(null)}
        refresh={refresh}
        />
      )}
    </div>
  );
}