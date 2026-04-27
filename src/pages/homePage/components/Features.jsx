import React from "react";
import { motion } from "framer-motion";
import {
ShoppingBag, Users, Package, BarChart3,
Bell, WifiOff, Receipt, CreditCard
} from "lucide-react";

const features = [
{ icon: ShoppingBag, title: "Multi-Shop Setup", desc: "Manage multiple shops easily." },
{ icon: Users, title: "Role-Based Access", desc: "Managers & cashiers with permissions." },
{ icon: Package, title: "Inventory Tracking", desc: "Track stock in real-time." },
{ icon: BarChart3, title: "Sales Analytics", desc: "Daily & monthly insights." },
{ icon: Bell, title: "Low Stock Alerts", desc: "Never run out of stock." },
{ icon: WifiOff, title: "Offline Mode", desc: "Sell without internet." },
{ icon: Receipt, title: "Receipts", desc: "Professional receipts instantly." },
{ icon: CreditCard, title: "Payments", desc: "Accept multiple payment types." }
];

export default function Features() {

const container = {
hidden: {},
show: {
transition: {
staggerChildren: 0.15
}
}
};

const item = {
hidden: { opacity: 0, y: 30 },
show: { opacity: 1, y: 0 }
};

return (
<section id="features" className="py-20 max-w-7xl mx-auto px-6">

<motion.h2
initial={{ opacity:0, y:20 }}
whileInView={{ opacity:1, y:0 }}
className="text-3xl font-bold text-center mb-12"
>
Features Built for Modern Retail
</motion.h2>

<motion.div
variants={container}
initial="hidden"
whileInView="show"
className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
>

{features.map((f, i) => {
const Icon = f.icon;

return (
<motion.div
key={i}
variants={item}
whileHover={{ scale:1.05, y:-6 }}
className="bg-white/60 dark:bg-gray-800/60 backdrop-blur p-6 rounded-xl shadow hover:shadow-xl transition"
>

<Icon className="text-emerald-500 mb-4" size={28}/>

<h3 className="font-semibold mb-2">{f.title}</h3>

<p className="text-sm text-gray-500 dark:text-gray-300">
{f.desc}
</p>

</motion.div>
);
})}

</motion.div>

<div className="text-center mt-12">
<a
href="#signup"
className="bg-emerald-500 px-6 py-3 rounded text-white shadow hover:scale-105"
>
Get Started Free – No Card Needed
</a>
</div>

</section>
);
}