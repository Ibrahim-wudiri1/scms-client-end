import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  Menu,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
  { name: "Inventory", path: "/inventory", icon: <Package size={18} /> },
  { name: "Sales", path: "/sales", icon: <ShoppingCart size={18} /> },
  { name: "Sales History", path: "/saleshistory", icon: <ShoppingCart size={18} /> },
  { name: "Customers", path: "/customers", icon: <Users size={18} /> },
  { name: "Reports", path: "/reports", icon: <BarChart2 size={18} /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  return (
    <div
      className={`bg-dark text-white min-h-screen transition-all duration-300 ${
        open ? "w-56" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between p-4">
        <h1 className={`text-lg font-semibold ${!open && "hidden"}`}>ShopSys</h1>
        <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-white">
          <Menu size={20} />
        </button>
      </div>

      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-md m-2 transition ${
              location.pathname === item.path
                ? "bg-primary text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            {item.icon}
            {open && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
