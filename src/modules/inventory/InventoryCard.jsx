export default function InventoryCard({ product, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col">
      <h3 className="font-semibold text-dark">{product.name}</h3>
      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
      <div className="flex justify-between mt-2 text-sm">
        <span>Stock: {product.inventory?.currentQty ?? 0}</span>
        <span className="font-medium text-primary">₦{product.sellingPrice}</span>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onEdit(product)}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
