import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import '../styles/sidebar.css';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  Menu,
} from "lucide-react";

const menuByRole = {
  SUPER_ADMIN: [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Inventory", path: "/inventory", icon: <Package size={18} /> },
    { name: "Users", path: "/users", icon: <Users size={18} /> },
    { name: "Sales", path: "/sales", icon: <ShoppingCart size={18} /> },
    { name: "Sales History", path: "/saleshistory", icon: <ShoppingCart size={18} /> },
    { name: "Customers", path: "/customers", icon: <Users size={18} /> },
    { name: "Reports", path: "/reports", icon: <BarChart2 size={18} /> },
  ],

  TENANT_ADMIN: [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Shops", path: "/shops", icon: <Package size={18} /> },
    { name: "Category", path: "/category", icon: <Package size={18} /> },
    { name: "Inventory", path: "/inventory", icon: <Package size={18} /> },
    { name: "Users", path: "/users", icon: <Users size={18} /> },
    { name: "Sales", path: "/sales", icon: <ShoppingCart size={18} /> },
    { name: "Sales History", path: "/saleshistory", icon: <ShoppingCart size={18} /> },
    { name: "Customers", path: "/customers", icon: <Users size={18} /> },
    { name: "Reports", path: "/reports", icon: <BarChart2 size={18} /> },
  ],

  MANAGER: [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Shops", path: "/shops", icon: <Package size={18} /> },
    { name: "Users", path: "/users", icon: <Users size={18} /> },
    { name: "Inventory", path: "/inventory", icon: <Package size={18} /> },
    { name: "Sales", path: "/sales", icon: <ShoppingCart size={18} /> },
    { name: "Sales History", path: "/saleshistory", icon: <ShoppingCart size={18} /> },
    { name: "Reports", path: "/reports", icon: <BarChart2 size={18} /> },
  ],

  CASHIER: [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Sales", path: "/sales", icon: <ShoppingCart size={18} /> },
    { name: "Sales History", path: "/saleshistory", icon: <ShoppingCart size={18} /> },
    { name: "Inventory", path: "/inventory", icon: <Package size={18} /> },
  ],
};

export default function Sidebar({ role }) {
  const menuItems = menuByRole[role] || [];
  const [open, setOpen] = useState(true);
  const location = useLocation();

  return (
    <div
      className={`sidebar sticky top-0 h-screen overflow-y-auto bg-gray-900 text-white shadow-xl transition-all duration-300 ${
        open ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className={`text-xl font-bold text-primary ${!open && "hidden"}`}>ShopSys</h1>
        <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-white transition">
          <Menu size={24} />
        </button>
      </div>

      <nav className="mt-6 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`menu-item flex items-center gap-3 px-4 py-3 rounded-lg m-1 transition-all duration-200 ${
              location.pathname === item.path
                ? "bg-primary text-white shadow-md"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {item.icon}
            {open && <span className="font-medium">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
