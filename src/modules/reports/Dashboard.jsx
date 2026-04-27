import { useEffect, useState } from "react";
import { reportApi } from "../../api/reportApi";
import StatCard from "./StatCard";
import SalesTable from "./SalesTable";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await reportApi.summary();
        console.log("Summary: ", result);
        
        setData(result);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err?.response?.data?.message || "Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="p-4 text-center">Loading dashboard...</p>;
  if (error) return <p className="p-4 text-red-600 text-center">{error}</p>;
  if (!data) return <p className="p-4 text-center">No data available</p>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Sales Today" 
          value={`$${Number(data.salesToday || 0).toFixed(2)}`} 
        />
        <StatCard 
          title="Sales This Month" 
          value={`$${Number(data.salesMonth || 0).toFixed(2)}`} 
        />
        <StatCard 
          title="Total Customers" 
          value={data.totalCustomers || 0} 
        />
        <StatCard 
          title="Low Stock Items" 
          value={data.lowStock || 0} 
        />
      </div>

      {/* TOP PRODUCTS */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Top Selling Products</h2>
        <SalesTable items={data.topProducts || []} />
      </div>
    </div>
  );
}