export default function CustomerCard({ customer, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-dark">{customer.name}</h3>
      <p className="text-sm text-gray-500">{customer.email}</p>
      <p className="text-sm text-gray-500">{customer.phone}</p>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onEdit(customer)}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(customer.id)}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
