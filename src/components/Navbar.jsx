import { useAuth } from "../context/AuthContext";

export default function Navbar(){
    const {user, logout} = useAuth();

    return (
        <header className="bg-white shadow flex justify-between items-center p-4">
            <h2 className="text-lg font-semibold text-dark">Shopping Complex</h2>
            <div className="flex items-center gap-4">
                <span className="text-gray-700 text-sm">{user?.name}</span>
                <button 
                    onClick={logout}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
                        Logout
                </button>
            </div>

        </header>
    );
}