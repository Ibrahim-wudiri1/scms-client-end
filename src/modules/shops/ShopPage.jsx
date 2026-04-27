import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import ShopsTable from "./ShopsTable";
import CreateShopModal from "./CreateShopModal";

export default function ShopsPage() {

  const [shops,setShops] = useState([]);
  const [loading,setLoading] = useState(true);
  const [showCreate,setShowCreate] = useState(false);

  const loadShops = async () => {
    try{
      const res = await axiosClient.get("/shops");
      console.log("Shops: ", res.data);
      setShops(res.data);
    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    loadShops();
  },[]);

  if(loading) return <div className="p-6">Loading shops...</div>;

  return(
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">Shops</h1>

        <button
        onClick={()=>setShowCreate(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Shop
        </button>

      </div>

      <ShopsTable shops={shops} refresh={loadShops}/>

      {showCreate && (
        <CreateShopModal
        close={()=>setShowCreate(false)}
        refresh={loadShops}
        />
      )}

    </div>
  );
}