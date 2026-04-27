import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import CategoriesTable from "./CategoryTable";
import CreateCategoryModal from "./AddCategoryModal";

import Spinner from "../../components/Spinner";

export default function categoriesPage() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const loadCategories = async () => {
    try{
      const res = await axiosClient.get("/category");
      console.log("Categroy: ", res.data);
      setCategories(res.data);
    }catch(err){
      console.error(err);
      alert(err.message);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    loadCategories();
  },[]);

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

      <CategoriesTable categories={filteredCategories} refresh={loadCategories}/>

      {showCreate && (
        <CreateCategoryModal
        close={()=>setShowCreate(false)}
        refresh={loadCategories}
        />
      )}

    </div>
  );
}
