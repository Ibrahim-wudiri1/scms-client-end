import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import {AuthProvider} from "./context/AuthContext";
import {TenantProvider} from "./context/TenantContext";
import {useAuth} from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
// import POS from "./pages/POS";
import DashboardLoyout from "./layouts/DashboardLoyout";
import InventoryList from "./modules/inventory/InventoryList";
import SalesPage from './modules/sales/SalesPage';
import SalesHistoryPage from './modules/sales/SalesHistoryPage';
import CustomerList from './modules/customers/CustomerList';
import ReportPage from './modules/reports/Dashboard';
import Overview from './modules/dashboard/Overview'; 
import Spinner from './components/Spinner';
import Users from './modules/users/UsersPage';
import { useShop } from "./context/ShopContext";

// user ? 
// : <Navigate to="/" />
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const {activeShop} = useShop();

  if (loading){ 
    return (
    <Spinner/>
  );
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if(!activeShop){
    return <p className="p-4">No shop configured</p>;
  }

  return children;
};


export default function App() {
  return (
    <AuthProvider>
      {/* <TenantProvider> */}
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLoyout>
                    <Overview />
                  </DashboardLoyout>
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <Users />
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
            path="/saleshistory"
            element={
              <PrivateRoute>
                <DashboardLoyout>
                  <SalesHistoryPage/>
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
    {/* </TenantProvider> */}
    </AuthProvider>
  );
}
