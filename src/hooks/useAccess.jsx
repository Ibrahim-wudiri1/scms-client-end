import { useAuth } from "../context/AuthContext";

export const useAccess = () => {

  const { user } = useAuth();

  const isAdmin = user?.role === "TENANT_ADMIN";
  const isManager = user?.role === "MANAGER";
  const isCashier = user?.role === "CASHIER";

  return {
    isAdmin,
    isManager,
    isCashier
  };
};