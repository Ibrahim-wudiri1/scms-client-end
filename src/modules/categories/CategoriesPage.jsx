import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import CategoriesTable from "./CategoryTable";
import CreateCategoryModal from "./AddCategoryModal";
import Spinner from "../../components/Spinner";
import { useShop } from "../../context/ShopContext";

export default function categoriesPage() {

  const { activeShop } = useShop();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const loadCategories = async () => {
    if (!activeShop) {
      console.warn("No active shop selected");
      setLoading(false);
      return;
    }
    
    try{
      const res = await axiosClient.get(`/shops/${activeShop.id}/categories`);
      console.log("Category: ", res.data);
      setCategories(res.data || []);
    }catch(err){
      console.error("Failed to fetch categories:", err);
      alert(err.response?.data?.message || "Failed to fetch categories. Please try again.");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    if (activeShop) {
      loadCategories();
    } else {
      setLoading(false);
    }
  },[activeShop]);

  const filteredCategories = categories.filter((c)=>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if(loading) return <Spinner/>;

  return(

    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">Categories</h1>

        <button
        onClick={()=>setShowCreate(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Category
        </button>

      </div>

      {/* Search */}

      <input
      type="text"
      placeholder="Search Category..."
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      className="border p-2 rounded w-64"
      />

      <CategoriesTable categories={filteredCategories} refresh={loadCategories} shopId={activeShop?.id} />

      {showCreate && (
        <CreateCategoryModal
        close={()=>setShowCreate(false)}
        refresh={loadCategories}
        />
      )}

    </div>
  );
}
