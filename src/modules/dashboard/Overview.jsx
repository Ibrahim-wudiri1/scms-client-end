import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import KpiCard from "./KpiCard";
import RecentSales from "./RecentSales";
import LowStock from "./LowStock";

export default function OverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get("/reports/overview").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="p-4">Loading overview...</p>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Sales Today" value={`$${data.salesToday}`} />
        <KpiCard title="Sales This Month" value={`$${data.salesThisMonth}`} />
        <KpiCard title="Customers" value={data.totalCustomers} />
        <KpiCard title="Low Stock Items" value={data.lowStockCount} />
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentSales sales={data.recentSales} />
        <LowStock products={data.lowStockProducts} />
      </div>
    </div>
  );
}
