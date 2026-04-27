import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../../../api/axiosClient";

export default function UpgradeModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (planCode) => {
    setLoading(true);
    try {
      const res = await axiosClient.post("/billing/paystack/initialize", {
        planCode,
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Upgrade failed:", err);
      setLoading(false);
    }
  };

  const plans = [
    {
      id: "monthly",
      name: "Monthly",
      price: "₦29,000",
      billingPeriod: "/month",
      planCode: "PLN_68pszny66jyelrp",
      features: [
        "Unlimited products",
        "Up to 5 team members",
        "Advanced inventory tracking",
        "Sales reports & analytics",
        "Email support",
      ],
      popular: false,
    },
    {
      id: "yearly",
      name: "Yearly",
      price: "₦290,000",
      billingPeriod: "/year",
      planCode: "PLN_xckemh2qcx82fq4",
      features: [
        "Everything in Monthly",
        "20% discount (Save ₦58,000)",
        "Priority support",
        "Advanced integrations",
        "Custom branding options",
      ],
      popular: true,
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[calc(100vh-2rem)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Unlock Full Access 🚀</h2>
                  <p className="text-indigo-100">
                    Choose the perfect plan for your business
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-indigo-100 hover:text-white transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(100vh-18rem)]">
              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative rounded-xl border-2 transition-all duration-300 p-6 ${
                      plan.popular
                        ? "border-indigo-600 bg-gradient-to-br from-indigo-50 to-transparent dark:from-indigo-950/20 dark:to-transparent"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>

                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                        {plan.billingPeriod}
                      </span>
                    </div>

                    <button
                      onClick={() => handleUpgrade(plan.planCode)}
                      disabled={loading}
                      className={`w-full py-3 rounded-lg font-medium transition-all duration-200 mb-6 ${
                        plan.popular
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                      }`}
                    >
                      {loading ? "Processing..." : "Get Started"}
                    </button>

                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-emerald-500 text-lg flex-shrink-0">✓</span>
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* Benefits Section */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Why Upgrade?
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> Unlimited everything
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> Advanced analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> Team collaboration
                  </li>
                </ul>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">
                  Questions about our plans?{" "}
                  <a href="#" className="text-indigo-600 hover:underline">
                    Contact support
                  </a>
                </p>
                <p>30-day money-back guarantee. Cancel anytime.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}