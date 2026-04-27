import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import ShopSwitcher from "./ShopSwitcher";
import TenantSwitcher from "./TenantSwitcher";
import {useAccess} from "../hooks/useAccess.jsx";

export default function Navbar({ tenants}){
    const {user, logout} = useAuth();
    const {activeShop} = useShop();
    const {isAdmin, isManager} = useAccess();

    const canSwitchShop = isAdmin || isManager;

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-accent shadow-lg flex justify-between items-center p-4 text-white">
            <h2 className="text-lg font-semibold">Shopping Complex</h2>
            <div className="flex items-center gap-4">
                 {/* <TenantSwitcher tenants={tenants} /> */}
                 {canSwitchShop ? (
                    <ShopSwitcher/>
                 ) : (
                    <span className="text-sm font-medium">{activeShop?.name || 'No Shop'}</span>
                 )}
                <span className="text-sm">{user?.name}</span>
                <button 
                    onClick={logout}
                    className="bg-white text-primary px-3 py-1 rounded hover:bg-gray-100 text-sm font-medium transition">
                        Logout
                </button>
            </div>

        </header>
    );
}