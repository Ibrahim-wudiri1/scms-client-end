import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";
import Spinner from "../../components/Spinner";

import KpiCard from "./KpiCard";
import RecentSales from "./RecentSales";
import LowStock from "./LowStock";
import SalesChart from "./SalesChart";

export default function OverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const { user } = useAuth();

  const role = user?.role || "guest";

  useEffect(() => {
  const loadOverview = async () => {
    try {
      const res = await axiosClient.get("/reports/overview");
      const chart = await axiosClient.get("/reports/sales-last-7-days");

      setData({
        salesToday: res.data.salesToday ?? 0,
        salesThisMonth: res.data.salesThisMonth ?? 0,
        totalCustomers: res.data.totalCustomers ?? 0,
        lowStockCount: res.data.lowStockCount ?? 0,
        recentSales: res.data.recentSales ?? [],
        lowStockProducts: res.data.lowStockProducts ?? [],
      });

      setChartData(chart.data);

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
        {(role === "SUPER_ADMIN" || role === "MANAGER") && (
          <KpiCard title="Customers" value={data.totalCustomers} />
        )}
        {(role === "SUPER_ADMIN" || role === "MANAGER") && (
          <KpiCard title="Low Stock Items" value={data.lowStockCount} />
        )}

        {(role === "SUPER_ADMIN" || role === "MANAGER") && (
          <SalesChart data={chartData} />
        )}
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentSales sales={data.recentSales} />
        {(role === "SUPER_ADMIN" || role === "MANAGER") && (
          <LowStock products={data.lowStockProducts} />
        )
        }
        
      </div>
    </div>
  );
}
