export default function LowStock({ products }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-3">Low Stock</h3>
      {products.length === 0 ? (
        <p className="text-sm text-gray-500">All stock levels OK</p>
      ) : (
        <ul className="space-y-2">
          {products.map((p) => (
            <li key={p.id} className="flex justify-between text-sm">
              <span>{p.name}</span>
              <span className="text-red-600 font-semibold">{p.qty}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
