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

<motion.div
initial={{ x:"100%" }}
animate={{ x:0 }}
exit={{ x:"100%" }}
className="fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg p-6"
>

<button onClick={()=>setOpen(false)} className="mb-6">
<X/>
</button>

<div className="flex flex-col gap-4">

<a href="#features" onClick={()=>setOpen(false)}>Features</a>
<a href="#pricing" onClick={()=>setOpen(false)}>Pricing</a>
<a href="#faq" onClick={()=>setOpen(false)}>FAQ</a>

<button onClick={toggleDark} className="flex gap-2 items-center">
{dark ? <Sun/> : <Moon/>} Toggle Mode
</button>

<a
href="#signup"
className="bg-emerald-500 text-white py-2 rounded text-center"
>
Get Started
</a>

</div>

</motion.div>

)}

</AnimatePresence>

</nav>
);
}