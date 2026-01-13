import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import DashboardLoyout from "./layouts/DashboardLoyout";
import InventoryList from "./layouts/InventoryList";
import SalesPage from './modules/sales/SalesPage';
import CustomerList from './modules/customers/CustomerList';
import ReportPage from './modules/reports/ReportPage';
import Overview from './modules/dashboard/Overview'; 

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLoyout>
                <Overview />
              </DashboardLoyout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pos"
          element={
            <PrivateRoute>
              <POS />
            </PrivateRoute>
          }
        />
      <Route
        path="/inventory"
        element={
          <PrivateRoute>
            <DashboardLoyout>
              <InventoryList />
            </DashboardLoyout>
          </PrivateRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <PrivateRoute>
            <DashboardLoyout>
              <SalesPage/>
            </DashboardLoyout>
          </PrivateRoute>
        }
      
      />
      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <DashboardLoyout>
              <CustomerList/>
            </DashboardLoyout>
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <DashboardLoyout>
              <ReportPage />
            </DashboardLoyout>
          </PrivateRoute>
        }
      />
      </Routes>
    </Router>
  );
}
