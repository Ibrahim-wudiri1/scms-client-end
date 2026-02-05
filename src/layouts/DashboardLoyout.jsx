import React, { Children } from 'react';
import Sibebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLoyout({children}) {

  return (
    <div className='flex min-h-screen'>
        <Sibebar/>
        <div className="flex-1 flex flex-col">
            <Navbar/>
            <main className='flex-1 p-6 bg-gray-50 overflow-y-auto'
            >{children}</main>
        </div>
    </div>
  );
}

export default DashboardLoyout;