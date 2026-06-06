import {useEffect, useState} from 'react';
import {inventoryApi} from "../../api/inventoryApi";
import ProductForm from "./ProductForm";
import InventoryCard from "./InventoryCard";
import {Plus, MoreVertical} from "lucide-react";
import { formatNaira } from "../../utils/formatters";

function InventoryList() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [quantityAmount, setQuantityAmount] = useState(0);
  const [newPrice, setNewPrice] = useState(0);

  const fetchProdeucts = async () => {
    const data = await inventoryApi.getAll();
    // console.log("Fetched products:", data);
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

  const openActionMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    if (!openMenuId) return;

    const handleOutsideClick = (event) => {
      const target = event.target;
      if (
        !target.closest('.inventory-action-menu') &&
        !target.closest('.inventory-action-button')
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [openMenuId]);

  const openQuantityModal = (product) => {
    setActiveProduct(product);
    setQuantityAmount(0);
    setOpenMenuId(null);
    setShowQuantityModal(true);
  };

  const openPriceModal = (product) => {
    setActiveProduct(product);
    setNewPrice(product.sellingPrice || 0);
    setOpenMenuId(null);
    setShowPriceModal(true);
  };

  const handleStockIn = async () => {
    if (!activeProduct || quantityAmount <= 0) {
      alert("Enter a valid quantity to add.");
      return;
    }
    await inventoryApi.stockIn(activeProduct.id, Number(quantityAmount));
    setShowQuantityModal(false);
    setActiveProduct(null);
    fetchProdeucts();
  };

  const handlePriceUpdate = async () => {
    if (!activeProduct || newPrice <= 0) {
      alert("Enter a valid price.");
      return;
    }
    await inventoryApi.update(activeProduct.id, { sellingPrice: Number(newPrice) });
    setShowPriceModal(false);
    setActiveProduct(null);
    fetchProdeucts();
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
                <td className="p-3">{p.inventory?.currentQty || 0}</td>
                <td className="p-3">{formatNaira(p.sellingPrice)}</td>
                <td className="p-3 text-right relative">
                  {/* 3 dot for menu */}
                  <button
                    onClick={() => openActionMenu(p.id)}
                    className="inventory-action-button inline-flex items-center justify-center w-10 h-10 rounded-full border text-gray-600 hover:bg-gray-100"
                  >
                    <MoreVertical />
                  </button>

                  {openMenuId === p.id && (
                    <div className="inventory-action-menu absolute right-0 top-12 z-50 w-48 rounded-lg border bg-white shadow-lg text-left">
                      <button
                        onClick={() => openQuantityModal(p)}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-slate-50"
                      >
                        Add Quantity
                      </button>
                      <button
                        onClick={() => openPriceModal(p)}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-slate-50"
                      >
                        Update Price
                      </button>
                      <button
                        onClick={() => {
                          setSelected(p);
                          setShowForm(true);
                          setOpenMenuId(null);
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-slate-50"
                      >
                        Edit Product
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(p.id);
                          setOpenMenuId(null);
                        }}
                        className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            onAddQuantity={openQuantityModal}
            onUpdatePrice={openPriceModal}
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

      {showQuantityModal && activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Add Quantity</h2>
            <p className="text-sm text-gray-600 mb-4">
              {activeProduct.name} <span className="font-medium">(Current stock: {activeProduct.inventory?.currentQty || 0})</span>
            </p>
            <label className="block mb-3 text-sm font-medium">Quantity to add</label>
            <input
              type="number"
              min="1"
              value={quantityAmount}
              onChange={(e) => setQuantityAmount(Number(e.target.value))}
              className="w-full rounded border p-3 focus:outline-none focus:border-blue-500"
            />
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowQuantityModal(false)}
                className="rounded bg-gray-200 px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleStockIn}
                className="rounded bg-blue-600 px-4 py-2 text-white"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {showPriceModal && activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Update Price</h2>
            <p className="text-sm text-gray-600 mb-4">
              {activeProduct.name} <span className="font-medium">(Current price: {formatNaira(activeProduct.sellingPrice)})</span>
            </p>
            <label className="block mb-3 text-sm font-medium">New selling price</label>
            <input
              type="number"
              min="0"
              value={newPrice}
              onChange={(e) => setNewPrice(Number(e.target.value))}
              className="w-full rounded border p-3 focus:outline-none focus:border-blue-500"
            />
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowPriceModal(false)}
                className="rounded bg-gray-200 px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handlePriceUpdate}
                className="rounded bg-blue-600 px-4 py-2 text-white"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryList