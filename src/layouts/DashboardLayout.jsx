import React, { Children } from 'react';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TenantHeader from "../modules/dashboard/components/TenantHeader";
import SubscriptionContainer from "../modules/dashboard/components/SubscriptionContainer";
import { useAuth } from '../context/AuthContext';

function DashboardLayout({children}) {

  const { user } = useAuth();

  const handleUpgradeClick = () => {
    // This can be used to trigger upgrade action if needed
    console.log('Upgrade clicked');
  };

  return (
    <div className='flex min-h-screen'>
        <Sidebar role={user?.role} />
        <div className="flex-1 flex flex-col">
            <Navbar user={user} />
            {/* Subscription management layer */}
            <SubscriptionContainer />
            {/* Tenant header with subscription status */}
            <TenantHeader onUpgradeClick={handleUpgradeClick} />
            <main className='flex-1 p-6 bg-gray-50 overflow-y-auto'
            >{children}</main>
        </div>
    </div>
  );
}

export default DashboardLayout;