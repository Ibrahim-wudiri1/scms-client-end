import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { formatNaira } from "../../utils/formatters";

export default function InventoryCard({ product, onEdit, onDelete, onAddQuantity, onUpdatePrice }) {
  const [openMenu, setOpenMenu] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!openMenu) return;

    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [openMenu]);

  return (
    <div ref={cardRef} className="bg-white shadow-sm rounded-lg p-4 flex flex-col relative">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-dark">{product.name}</h3>
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
        </div>
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="inline-flex items-center justify-center h-10 w-10 rounded-full border text-gray-600 hover:bg-gray-100"
          aria-label="Open actions"
        >
          <MoreVertical />
        </button>
      </div>

      <div className="flex justify-between mt-3 text-sm">
        <span>Stock: {product.inventory?.currentQty ?? 0}</span>
        <span className="font-medium text-primary">{formatNaira(product.sellingPrice)}</span>
      </div>

      {openMenu && (
        <div className="absolute right-4 top-14 z-50 w-48 rounded-lg border bg-white shadow-lg">
          <button
            onClick={() => {
              onAddQuantity(product);
              setOpenMenu(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-slate-50"
          >
            Add Quantity
          </button>
          <button
            onClick={() => {
              onUpdatePrice(product);
              setOpenMenu(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-slate-50"
          >
            Update Price
          </button>
          <button
            onClick={() => {
              onEdit(product);
              setOpenMenu(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-slate-50"
          >
            Edit Product
          </button>
          <button
            onClick={() => {
              onDelete(product.id);
              setOpenMenu(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
