import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SubscriptionGate({ subscription, onUpgrade }) {
  if (!subscription) return null;

  const expired =
    subscription.status === "trialing" &&
    new Date() > new Date(subscription.currentPeriodEnd);

  if (!expired) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          className="bg-white dark:bg-gray-900 p-10 rounded-2xl text-center max-w-md shadow-2xl"
        >
          <div className="mb-6">
            <span className="text-5xl">📌</span>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Your Trial Has Ended
          </h2>

          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Your free trial period has expired. Upgrade now to continue managing your shop and access all premium features.
          </p>

          <div className="space-y-3">
            <button
              onClick={onUpgrade}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
            >
              Upgrade Now
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Choose from flexible monthly or yearly plans
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}