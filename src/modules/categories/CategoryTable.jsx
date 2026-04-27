import { useState } from "react";
import EditCategory from "./EditCategory";

export default function CategoriesTable({ categories, refresh }) {

  const [selectedCategory, setSelectedCategory] = useState(null);


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
            <th className="text-left p-3">Created</th>
            <th className="text-right p-3">Action</th>
          </tr>
        </thead>

       <tbody>
          {/* {categories} */}
            {categories.map((category)=>(

            <tr key={category.id} className="border-t hover:bg-gray-50">

            <td className="p-3 font-medium">
            {category.name}
            </td>

            <td className="p-3">
            {category.createdAt}
            </td>

            <td className="p-3 text-right space-x-3">
                <button
                onClick={()=>setSelectedCategory(category)}
                className="text-blue-600 hover:underline"
                >
                Edit
                </button>
            </td>

            </tr>

            ))}

            </tbody>


      </table>

      {selectedCategory && (
        <EditCategory
          category={selectedCategory}
          close={() => setSelectedCategory(null)}
          refresh={refresh}
        />
      )}
    </div>
  );
}
