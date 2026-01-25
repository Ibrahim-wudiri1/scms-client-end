import { useEffect, useState } from "react";
import { reportApi } from "../../api/reportApi";
import StatCard from "./StatCard";
import SalesTable from "./SalesTable";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    reportApi.summary().then(setData);
  }, []);

  if (!data) return <p className="p-4">Loading dashboard...</p>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Sales Today" value={`$${data.salesToday}`} />
        <StatCard title="Sales This Month" value={`$${data.salesMonth}`} />
        <StatCard title="Customers" value={data.customers} />
        <StatCard title="Low Stock Items" value={data.lowStock} />
      </div>

      {/* TOP PRODUCTS */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Top Products</h2>
        <SalesTable items={data.topProducts} />
      </div>
    </div>
  );
}
