import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import axiosClient from "../../../api/axiosClient";
import TrialBanner from "./TrialBanner";
import SubscriptionGate from "./SubscriptionGate";
import UpgradeModal from "./UpgradeModal";

export default function SubscriptionContainer() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.tenantId) {
        setLoading(false);
        return;
      }
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

  const handleUpgrade = () => {
    setUpgradeModalOpen(true);
  };

  const handleUpgradeClose = () => {
    setUpgradeModalOpen(false);
  };

  if (loading) return null;

  return (
    <>
      {/* Trial Banner - Shows at the top of dashboard */}
      <TrialBanner subscription={subscription} onUpgrade={handleUpgrade} />

      {/* Subscription Gate - Full screen modal when trial expires */}
      <SubscriptionGate subscription={subscription} onUpgrade={handleUpgrade} />

      {/* Upgrade Modal - Opens when user clicks upgrade button */}
      <UpgradeModal open={upgradeModalOpen} onClose={handleUpgradeClose} />
    </>
  );
}
