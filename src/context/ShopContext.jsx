import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [shops, setShops] = useState([]);
  const [activeShop, setActiveShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
       const token = localStorage.getItem("token");
        if (!token) return; 
      axiosClient.get("/shops").then((res) => {
      setShops(res.data);

      const savedShop = localStorage.getItem("activeShop");
      if(savedShop){
        setActiveShop(JSON.parse(savedShop));
      }else if(res.data.length > 0){
        setActiveShop(res.data[0]);
        localStorage.setItem("activeShop", JSON.stringify(res.data[0]));
      }
    }).finally(() => setLoading(false));
    } catch (error) {
      console.log("Error: ", error);
    }
    
  }, []);

  const switchShop =(shop) =>{
    setActiveShop(shop);
    localStorage.setItem("activeShop", JSON.stringify(shop));
  };

  return (
    <ShopContext.Provider
      value={{ shops, activeShop, switchShop, loading }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
