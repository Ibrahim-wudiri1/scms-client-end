import React, { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {

const [dark, setDark] = useState(false);
const [open, setOpen] = useState(false);

const toggleDark = () => {
setDark(!dark);
document.documentElement.classList.toggle("dark");
};

return (
<nav className="sticky top-0 z-50 backdrop-blur bg-white/30 dark:bg-gray-900/30 border-b">

<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">

<h1 className="font-bold text-indigo-700">ShopSys</h1>

<div className="hidden md:flex gap-6 items-center">

<a href="#features">Features</a>
<a href="#pricing">Pricing</a>
<a href="#faq">FAQ</a>

<button onClick={toggleDark}>
    {dark ? <Sun/> : <Moon/>}
</button>

<button className="text-sm"
    onClick={()=> window.location.href = "/login"}
>
    Sign In
</button>

<a href="/signup" className="bg-emerald-500 px-4 py-2 rounded text-white">
Sign Up Free
</a>

</div>

<button onClick={()=>setOpen(true)} className="md:hidden">
<Menu/>
</button>

</div>

{/* MOBILE DRAWER */}

<AnimatePresence>
  {open && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
        onClick={() => setOpen(false)}
      />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white dark:bg-slate-950 shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-semibold">Menu</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <a href="#features" onClick={() => setOpen(false)} className="text-lg">
            Features
          </a>
          <a href="#pricing" onClick={() => setOpen(false)} className="text-lg">
            Pricing
          </a>
          <a href="#faq" onClick={() => setOpen(false)} className="text-lg">
            FAQ
          </a>

          <button
            onClick={toggleDark}
            className="flex gap-2 items-center py-3 px-4 rounded border border-slate-200 dark:border-slate-700"
          >
            {dark ? <Sun /> : <Moon />} Toggle Mode
          </button>

          <button
            onClick={() => {
              setOpen(false);
              window.location.href = "/login";
            }}
            className="w-full py-3 rounded border border-slate-200 text-left"
          >
            Sign In
          </button>

          <a
            href="/signup"
            className="block w-full text-center bg-emerald-500 text-white py-3 rounded"
          >
            Get Started
          </a>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

</nav>
);
}