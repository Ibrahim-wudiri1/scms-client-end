import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useTenant } from "../../../context/TenantContext";
import axiosClient from "../../../api/axiosClient";

export default function TenantHeader({ onUpgradeClick }) {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.tenantId) return;
      try {
        const res = await axiosClient.get("/auth/subscription");
        setSubscription(res.data);
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [user?.tenantId]);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSubscriptionStatus = () => {
    if (!subscription) return { status: "free", label: "Free Plan", color: "gray" };

    switch (subscription.status) {
      case "trialing":
        const daysLeft = Math.ceil(
          (new Date(subscription.currentPeriodEnd) - new Date()) / (1000 * 60 * 60 * 24)
        );
        return {
          status: "trial",
          label: `Trial - ${daysLeft} days left`,
          color: "amber",
          daysLeft,
          planLabel: subscription.plan || "Trial",
          endDate: formatDate(subscription.currentPeriodEnd),
        };
      case "active":
        return {
          status: "active",
          label: `${subscription.plan || "Paid"} Plan`,
          color: "emerald",
          planLabel: subscription.plan || "Paid",
          endDate: formatDate(subscription.currentPeriodEnd),
        };
      case "canceled":
        return {
          status: "canceled",
          label: "Canceled",
          color: "red",
          planLabel: subscription.plan || "Paid",
          endDate: formatDate(subscription.currentPeriodEnd),
        };
      case "past_due":
        return {
          status: "past_due",
          label: "Payment Due",
          color: "orange",
          planLabel: subscription.plan || "Paid",
          endDate: formatDate(subscription.currentPeriodEnd),
        };
      default:
        return {
          status: "inactive",
          label: "Inactive",
          color: "gray",
          planLabel: subscription.plan || "Free",
          endDate: formatDate(subscription.currentPeriodEnd),
        };
    }
  };

  const statusInfo = getSubscriptionStatus();
  const colorClasses = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    red: "bg-red-50 border-red-200 text-red-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    gray: "bg-gray-50 border-gray-200 text-gray-800",
  };

  const badgeColors = {
    emerald: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-800",
    orange: "bg-orange-100 text-orange-800",
    gray: "bg-gray-100 text-gray-800",
  };

  return (
    <div className={`border-b ${colorClasses[statusInfo.color]} transition-colors duration-300`}>
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold text-lg">
              {user?.temporaryShopName || user?.name || "Dashboard"}
            </h3>
            {/* //|| user?.tenantId} */}
            <p className="text-xs text-gray-500 mt-0.5">Tenant ID: {tenant?.id || user?.tenantId}</p>
            {subscription?.status === "active" && statusInfo.endDate && (
              <p className="text-xs text-gray-500 mt-0.5">
                {statusInfo.planLabel} • Expires {statusInfo.endDate}
              </p>
            )}
            {subscription?.status === "canceled" && statusInfo.planLabel && (
              <p className="text-xs text-gray-500 mt-0.5">
                {statusInfo.planLabel} • Canceled
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${badgeColors[statusInfo.color]} border border-current`}>
            {statusInfo.status === "trial" && "⏳ "}
            {statusInfo.status === "active" && "✓ "}
            {statusInfo.status === "canceled" && "⚠️ "}
            {statusInfo.label}
          </div>

          {(statusInfo.status === "trial" || statusInfo.status === "inactive" || statusInfo.status === "canceled") && (
            <button
              onClick={onUpgradeClick}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 whitespace-nowrap"
            >
              {statusInfo.status === "trial" ? "Upgrade Now" : "Get Started"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
