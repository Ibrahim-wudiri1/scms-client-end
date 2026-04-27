import React, { useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../../../api/axiosClient";

export default function Pricing() {
  const [loading, setLoading] = useState(null);

  const plans = [
    {
      name: "Monthly",
      price: "₦29,000",
      period: "/mo",
      paystackPriceId: "PLN_68pszny66jyelrp", // 🔥 replace
    },
    {
      name: "Yearly",
      price: "₦290,000",
      period: "/yr",
      popular: true,
      paystackPriceId: "PLN_xckemh2qcx82fq4", // 🔥 replace
    },
  ];

  const handleCheckout = async (planCode) => {
  try {
    setLoading(planCode);
    const res = await axiosClient.post("/billing/paystack/initialize", {
      planCode,
    });

    window.location.href = res.data.url;
  } catch (err) {
    console.log("Something went wrong. Try again.", err)
    alert("Something went wrong. Try again.");
  } finally {
    setLoading(null);
  }
};
  // const handleCheckouts = async (priceId) => {
  //   try {
  //     setLoading(priceId);

  //     const res = await axiosClient.post("/billing/checkout", {
  //       priceId,
  //     });

  //     // Redirect to Stripe Checkout
  //     window.location.href = res.data.url;
  //   } catch (err) {
  //     console.error(err);
  //     console.log("Something went wrong. Try again.", err)
  //     alert("Something went wrong. Try again.");
  //   } finally {
  //     setLoading(null);
  //   }
  // };

  return (
    <section id="pricing" className="py-20 max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-12">
        Simple, Transparent Pricing
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`p-8 rounded-xl shadow bg-white dark:bg-gray-800 transition
            ${plan.popular ? "ring-2 ring-emerald-500 shadow-xl" : ""}`}
          >
            {plan.popular && (
              <div className="text-xs bg-emerald-500 text-white px-3 py-1 rounded mb-4 inline-block">
                Most Popular
              </div>
            )}

            <h3 className="text-xl font-bold mb-4">{plan.name}</h3>

            <div className="text-4xl font-bold mb-6">
              {plan.price}
              <span className="text-sm">{plan.period}</span>
            </div>

            <button
              onClick={() => handleCheckout(plan.paystackPriceId)}
              disabled={loading === plan.paystackPriceId}
              className="bg-emerald-500 hover:bg-emerald-600 w-full text-white py-3 rounded-lg transition"
            >
              {loading === plan.paystackPriceId
                ? "Redirecting..."
                : "Start Free Trial"}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}