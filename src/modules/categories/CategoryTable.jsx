import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import EditCategory from "./EditCategory";

export default function CategoriesTable({ categories, refresh, shopId }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const deleteCategory = async (category) => {
    if (!shopId) {
      return alert("No shop selected for delete action.");
    }

    const confirmDelete = window.confirm(
      `Delete category "${category.name}"? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await axiosClient.delete(`/shops/${shopId}/categories/${category.id}`);
      alert("Category deleted successfully.");
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
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
                onClick={() => setSelectedCategory(category)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCategory(category)}
                className="text-red-600 hover:underline"
              >
                Delete
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
