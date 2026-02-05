import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import {TenantProvider} from "./context/TenantContext";
import {AuthProvider} from "./context/AuthContext.jsx";
import {ShopProvider} from "./context/ShopContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <TenantProvider>
        <ShopProvider>
          <App />
        </ShopProvider>
      </TenantProvider>
  </StrictMode>,
)
