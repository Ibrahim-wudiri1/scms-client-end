import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import {AuthProvider} from "./context/AuthContext";
import {ShopProvider} from "./context/ShopContext.jsx";
import {TenantProvider} from "./context/TenantContext";
import {useAuth} from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
// import POS from "./pages/POS";
import DashboardLayout from "./layouts/DashboardLayout";
import InventoryList from "./modules/inventory/InventoryList";
import SalesPage from './modules/sales/SalesPage';
import SalesHistoryPage from './modules/sales/SalesHistoryPage';
import CustomerList from './modules/customers/CustomerList';
import ReportPage from './modules/reports/Dashboard';
import Overview from './modules/dashboard/Overview'; 
import ShopPage from "./modules/shops/ShopPage";
import CategoryPage from "./modules/categories/CategoriesPage";

import HomePage from "./pages/homePage/NewHome";

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

  // if(!activeShop){
  //   return <p className="p-4">No shop configured</p>;
  // }

  return children;
};


export default function App() {
  return (
    <AuthProvider>
      {/* <TenantProvider> */}
      <ShopProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path="/login" element={<Login />} /> */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Overview />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Users />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/shops"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <ShopPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/category"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <CategoryPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
          <Route
            path="/inventory"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <InventoryList />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <SalesPage/>
                </DashboardLayout>
              </PrivateRoute>
            }
          
          />
          <Route
            path="/saleshistory"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <SalesHistoryPage/>
                </DashboardLayout>
              </PrivateRoute>
            }
          
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <CustomerList/>
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <ReportPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          </Routes>
        </Router>
    {/* </TenantProvider> */}
      </ShopProvider>
    </AuthProvider>
  );
}
