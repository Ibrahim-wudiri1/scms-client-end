import React, { useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../api/axiosClient";

export default function Signup() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    tenantName: "",
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (!form.tenantName) return setError("Enter your shop name");
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);
      setError("");

      const res = await axiosClient.post("/auth/register", {
        tenantName: form.tenantName,
        admin: {
          name: form.name,
          email: form.email,
          password: form.password,
        },
      });

      localStorage.setItem("token", res.data.token);

      // redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
      >
        {/* Logo */}
        <h1 className="text-2xl font-bold text-center text-indigo-700 dark:text-white mb-2">
          ShopSys
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Create your account
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <label className="block mb-2 text-sm font-medium">
              Business / Shop Name
            </label>
            <input
              type="text"
              name="tenantName"
              value={form.tenantName}
              onChange={handleChange}
              className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Zara Fashion Store"
            />

            <button
              onClick={nextStep}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mb-4 p-3 border rounded-lg"
              placeholder="John Doe"
            />

            <label className="block mb-2 text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mb-4 p-3 border rounded-lg"
              placeholder="you@email.com"
            />

            <label className="block mb-2 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mb-2 p-3 border rounded-lg"
              placeholder="••••••••"
            />

            {/* Password Strength */}
            <p className="text-xs text-gray-500 mb-4">
              Must be at least 6 characters
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition"
            >
              {loading ? "Creating Account..." : "Start Free Trial"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-3 text-sm text-gray-500 hover:underline"
            >
              Back
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          14-day free trial • No card required
        </p>
      </motion.div>
    </div>
  );
}