import React from "react";
import { motion } from "framer-motion";

export default function TrialBanner({ subscription, onUpgrade }) {
  if (!subscription || subscription.status !== "trialing") return null;

  const daysLeft = Math.ceil(
    (new Date(subscription.currentPeriodEnd) - new Date()) /
      (1000 * 60 * 60 * 24)
  );

  if (daysLeft <= 0) return null;

  const urgency = daysLeft <= 3 ? "high" : daysLeft <= 7 ? "medium" : "low";
  const bgColor = urgency === "high" ? "bg-red-50" : urgency === "medium" ? "bg-amber-50" : "bg-blue-50";
  const borderColor = urgency === "high" ? "border-red-200" : urgency === "medium" ? "border-amber-200" : "border-blue-200";
  const textColor = urgency === "high" ? "text-red-800" : urgency === "medium" ? "text-amber-800" : "text-blue-800";
  const iconColor = urgency === "high" ? "text-red-500" : urgency === "medium" ? "text-amber-500" : "text-blue-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} border-b ${borderColor} px-6 py-4 flex justify-between items-center`}
    >
      <div className="flex items-center gap-3">
        <span className={`text-2xl ${iconColor}`}>⏳</span>
        <div>
          <p className={`text-sm font-semibold ${textColor}`}>
            Your trial ends in {daysLeft} {daysLeft === 1 ? "day" : "days"}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {urgency === "high"
              ? "Hurry! Your free trial is expiring soon."
              : urgency === "medium"
              ? "Don't miss out on premium features."
              : "Explore all premium features before your trial ends."}
          </p>
        </div>
      </div>

      <button
        onClick={onUpgrade}
        className={`px-5 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 whitespace-nowrap ${
          urgency === "high"
            ? "bg-red-600 hover:bg-red-700"
            : urgency === "medium"
            ? "bg-amber-600 hover:bg-amber-700"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        Upgrade Now
      </button>
    </motion.div>
  );
}