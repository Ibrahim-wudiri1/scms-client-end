import {useEffect, useState} from 'react';
import {inventoryApi} from "../../api/inventoryApi";
import ProductForm from "./ProductForm";
import InventoryCard from "./InventoryCard";
import {Plus} from "lucide-react";

function InventoryList() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchProdeucts = async () => {
    const data = await inventoryApi.getAll();
    setProducts(data);
  };

  useEffect(() =>{
    fetchProdeucts();
  }, []);

  const handleSave = async (data) => {
    if(selected) {
      await inventoryApi.update(selected.id, data);
    }else{
      await inventoryApi.create(data);
    }

    setShowForm(false);
    setSelected(null);
    fetchProdeucts();
  };

  const handleDelete = async (id) => {
    if(confirm("Are you sure you want to delete this product?")){
      await inventoryApi.remove(id);
      fetchProdeucts();
    }
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-dark">Invenntory</h1>
        <button className="flex items-center gap-2 btn-primary"
          onClick={()=> setShowForm(true)}
        >
          <Plus size={18}/> Add Product
        </button>
      </div>

      {/* Responsive layout */}
      <div className="hidden md:block">
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className='p-3'>Name</th>
              <th className='p-3'>SKU</th>
              <th className='p-3'>Stock</th>
              <th className='p-3'>Selling Price</th>
              <th className='p-3'>Actions</th>
            </tr>

          </thead>
          <tbody>
            {products.map((p) =>(
              <tr key={p.id} className='border-t'>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.sku}</td>
                <td className="p-3">{p.inventory?.currentqty ?? 0}</td>
                <td className="p-3">${p.sellingPrice}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() =>{
                      setSelected(p);
                      setShowForm(true);
                    }}
                   className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                   className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>

            ))}
          </tbody>
        </table>

        {/* Mobile Card */}
        <div className="grid md:hidden gap-3">
          {products.map((p)=> (
            <InventoryCard
              key={p.id}
              product={p}
              onEdit={(prod) => {
                setSelected(prod);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
        {showForm && (
          <ProductForm
            product={selected}
            onSave={handleSave}
            onClose={() => {
              setShowForm(false);
              setSelected(null);
            }}
          
          />
        )}
      </div>
    </div>
  );
}

export default InventoryList