import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import KpiCard from "./KpiCard";
import RecentSales from "./RecentSales";
import LowStock from "./LowStock";
import Spinner from "../../components/Spinner";

export default function OverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadOverview = async () => {
    try {
      const res = await axiosClient.get("/reports/overview");
      setData({
        salesToday: res.data.salesToday ?? 0,
        salesThisMonth: res.data.salesThisMonth ?? 0,
        totalCustomers: res.data.totalCustomers ?? 0,
        lowStockCount: res.data.lowStockCount ?? 0,
        recentSales: res.data.recentSales ?? [],
        lowStockProducts: res.data.lowStockProducts ?? [],
      });

    } catch (err) {
      console.error("Failed to load overview", err);
    } finally {
      setLoading(false);
    }
  };

  loadOverview();
}, []);


  if (loading) return <Spinner/>;

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
