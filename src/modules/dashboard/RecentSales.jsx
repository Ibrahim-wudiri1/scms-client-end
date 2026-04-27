export default function RecentSales({ sales }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-3">Recent Sales</h3>
      {sales.length === 0 ? (
        <p className="text-sm text-gray-500">No sales yet</p>
      ) : (
        <ul className="space-y-2">
          {sales.map((s) => (
            <li key={s.id} className="flex justify-between text-sm">
              <span>{new Date(s.createdAt).toLocaleDateString()}</span>
              <span className="font-medium">${(s.totalAmount ?? 0).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
