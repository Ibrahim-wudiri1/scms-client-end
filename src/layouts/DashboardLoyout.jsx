import React, { Children } from 'react';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from '../context/AuthContext';

function DashboardLayout({children}) {

  const { user } = useAuth();

  return (
    <div className='flex min-h-screen'>
        <Sidebar role={user?.role} />
        <div className="flex-1 flex flex-col">
            <Navbar user={user} />
            <main className='flex-1 p-6 bg-gray-50 overflow-y-auto'
            >{children}</main>
        </div>
    </div>
  );
}

export default DashboardLayout;