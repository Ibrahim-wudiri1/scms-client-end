export default function SalesTable({ items }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Qty</th>
            <th className="p-3 text-left">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-3">{i.product.name}</td>
              <td className="p-3">{i.quantitySold}</td>
              {/* <td className="p-3">${i.revenue.toFixed(2)}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
