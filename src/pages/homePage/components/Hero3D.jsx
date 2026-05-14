import React, { useState } from "react";

export default function Hero3D({ setDemoOpen }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  return (
    <section
      onMouseMove={(e) => {
        const x = (e.clientY / window.innerHeight - 0.5) * 10;
        const y = (e.clientX / window.innerWidth - 0.5) * 10;
        setRotate({ x, y });
      }}
      className="min-h-[80vh] flex items-center justify-center text-center px-6 py-12"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          Run Every Shop Smarter
        </h1>

        <div
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
          }}
          className="mx-auto max-w-md sm:max-w-xl bg-white/20 backdrop-blur rounded-xl shadow-xl p-6 sm:p-10"
        >
            <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-200">
                Inventory, offline POS, sales reports, low-stock alerts, team roles and receipts — built for shopping complex tenants.
            </p>
        </div>

        <button
          onClick={() => setDemoOpen(true)}
          className="mt-6 bg-emerald-500 px-6 py-3 text-white rounded-lg hover:bg-emerald-600 transition"
        >
          Watch Demo
        </button>
      </div>
    </section>
  );
}