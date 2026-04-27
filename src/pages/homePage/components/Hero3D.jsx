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
      className="h-screen flex items-center justify-center text-center"
    >
      <div>
        <h1 className="text-5xl font-bold mb-6">
          Run Every Shop Smarter
        </h1>

        <div
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
          }}
          className="w-[320px] h-[200px] mx-auto bg-white/20 backdrop-blur rounded-xl shadow-xl"
        >
            <p className="text-lg p-10 mb-8">
                Inventory, offline POS, sales reports, low-stock alerts, team roles and receipts 
                —
                built for shopping complex tenants.
            </p>
        </div>

        <button
          onClick={() => setDemoOpen(true)}
          className="mt-6 bg-emerald-500 px-6 py-3 text-white rounded"
        >
          Watch Demo
        </button>
      </div>
    </section>
  );
}