import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";


const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  // const { user } = useAuth();
  const auth = useAuth();
  const user = auth?.user; 
  const [tenant, setTenant] = useState(null);

  useEffect(() => {
    if (user?.tenantId) {
      setTenant(user.tenantId);
    }
  }, [user]);

  return (
    <TenantContext.Provider value={{ tenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);






// import { createContext, useContext, useState, useEffect } from "react";

// const TenantContext = createContext();

// export const TenantProvider = ({ children }) => {
//   const [tenant, setTenant] = useState(null);

//   useEffect(() => {
//     const saved = localStorage.getItem("tenant");
//     if (saved) setTenant(JSON.parse(saved));
//   }, []);

//   const switchTenant = (tenant) => {
//     setTenant(tenant);
//     localStorage.setItem("tenant", JSON.stringify(tenant));
//   };

//   return (
//     <TenantContext.Provider value={{ tenant, switchTenant }}>
//       {children}
//     </TenantContext.Provider>
//   );
// };

// export const useTenant = () => useContext(TenantContext);
