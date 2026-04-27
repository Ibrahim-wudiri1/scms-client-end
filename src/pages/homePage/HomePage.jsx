import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import {
Menu,
X,
Sun,
Moon,
ShoppingBag,
Users,
BarChart3,
Package,
Bell,
WifiOff,
Receipt,
CreditCard,
MessageCircle
} from "lucide-react";

/*
SEO NOTES
<title>ShopSys – Your Entire Mall Shop, One Smart Dashboard</title>
<meta name="description" content="Inventory, offline POS, receipts and analytics for shopping complex tenants." />
*/

export default function App() {

const [dark, setDark] = useState(false);
const [mobileOpen, setMobileOpen] = useState(false);
const [demoOpen, setDemoOpen] = useState(false);
const [faqOpen, setFaqOpen] = useState(null);

const toggleDark = () => {
setDark(!dark);
document.documentElement.classList.toggle("dark");
};

/* Stripe Ready Checkout */
const handleCheckout = async (priceId) => {
console.log("Stripe Checkout:", priceId);
alert("Stripe integration placeholder.");
};

/* Feature Data */

const features = [
{
icon: ShoppingBag,
title: "Multi-Shop Setup",
desc: "Run multiple stores inside the same complex dashboard."
},
{
icon: Users,
title: "Role-Based Access",
desc: "Managers, cashiers and staff with controlled permissions."
},
{
icon: Package,
title: "Inventory Tracking",
desc: "Monitor stock in real-time across all shops."
},
{
icon: BarChart3,
title: "Sales Analytics",
desc: "Understand daily performance and growth."
},
{
icon: Bell,
title: "Low Stock Alerts",
desc: "Get notified when inventory is running low."
},
{
icon: WifiOff,
title: "Offline Sales Mode",
desc: "Continue selling even without internet."
},
{
icon: Receipt,
title: "Receipt Generation",
desc: "Print professional receipts instantly."
},
{
icon: CreditCard,
title: "Multi-Payment Support",
desc: "Cash, transfer, POS and digital payments."
}
];

/* Pricing */

const plans = [
{
name: "Monthly",
price: "₦29,000",
period: "/mo",
stripePriceId: "price_monthly_placeholder"
},
{
name: "Yearly",
price: "₦290,000",
period: "/yr",
popular: true,
stripePriceId: "price_yearly_placeholder"
}
];

/* FAQ */

const faqs = [
{
q: "Does ShopSys work offline?",
a: "Yes. Sales can continue even when internet is unavailable."
},
{
q: "Can I manage multiple shops?",
a: "Yes. ShopSys allows you to manage several shops in one dashboard."
},
{
q: "Is there a free trial?",
a: "Yes, we offer a 14-day free trial."
},
{
q: "Can I add my staff?",
a: "Absolutely. Assign roles like Manager or Cashier."
}
];

/* Animation */

const fadeUp = {
initial: { opacity: 0, y: 40 },
whileInView: { opacity: 1, y: 0 },
transition: { duration: 0.6 }
};

return (
<div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">

{/* NAVBAR */}

<nav className="sticky top-0 backdrop-blur bg-white/70 dark:bg-gray-900/70 z-50 border-b">
<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

<div className="flex items-center gap-2 font-bold text-xl text-indigo-800 dark:text-white">
ShopSys
</div>

<div className={`hidden md:flex ${mobileOpen ? "block" : "hidden"} gap-8 text-sm`}>
<a href="#features">Features</a>
<a href="#how">How It Works</a>
<a href="#pricing">Pricing</a>
<a href="#faq">FAQ</a>
</div>

<div className="hidden md:flex items-center gap-4">
<button onClick={toggleDark}>
{dark ? <Sun size={20}/> : <Moon size={20}/>}
</button>

<button className="text-sm"
    onClick={()=> window.location.href = "/login"}
>Sign In</button>

<a
href="#signup"
className="bg-emerald-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105"
>
Sign Up Free
</a>
</div>

<button
className="md:hidden"
onClick={() => setMobileOpen(!mobileOpen)}
>
{mobileOpen ? <X/> : <Menu/>}
</button>

</div>
</nav>

{/* HERO */}

<section className="min-h-screen flex items-center justify-center text-center px-6">

<motion.div {...fadeUp} className="max-w-3xl">

<h1 className="text-4xl md:text-6xl font-bold mb-6 text-indigo-800 dark:text-white">
ShopSys – Run Every Shop in Your Complex Like a Pro
</h1>

<p className="text-lg mb-8">
Inventory, offline POS, sales reports, low-stock alerts, team roles and receipts —
built for shopping complex tenants.
</p>

<div className="flex justify-center gap-4">

<button
className="bg-emerald-500 px-6 py-3 rounded-lg text-white shadow-lg"
>
Start 14-Day Free Trial
</button>

<button
onClick={() => setDemoOpen(true)}
className="border px-6 py-3 rounded-lg"
>
Watch Demo
</button>

</div>

</motion.div>

</section>

{/* FEATURES */}

<section id="features" className="py-20 max-w-7xl mx-auto px-6">

<motion.h2 {...fadeUp} className="text-3xl font-bold text-center mb-12">
Features
</motion.h2>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

{features.map((f,i)=>{

const Icon = f.icon;

return(

<motion.div
key={i}
whileHover={{scale:1.05,y:-5}}
className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
>

<Icon className="text-emerald-500 mb-4"/>

<h3 className="font-semibold mb-2">{f.title}</h3>

<p className="text-sm text-gray-500">{f.desc}</p>

</motion.div>

);

})}

</div>

</section>

{/* HOW IT WORKS */}

<section id="how" className="py-20 bg-gray-100 dark:bg-gray-800 text-center">

<h2 className="text-3xl font-bold mb-12">How It Works</h2>

<div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">

{["Sign Up","Add Shops","Start Selling","View Reports"].map((step,i)=>(
<motion.div key={i} {...fadeUp}>

<div className="text-4xl font-bold text-emerald-500 mb-3">
{i+1}
</div>

<p>{step}</p>

</motion.div>
))}

</div>

</section>

{/* PRICING */}

<section id="pricing" className="py-20 max-w-6xl mx-auto px-6">

<h2 className="text-3xl font-bold text-center mb-12">
Pricing
</h2>

<div className="grid md:grid-cols-2 gap-8">

{plans.map((plan,i)=>(

<motion.div
key={i}
whileHover={{scale:1.05}}
className={`p-8 rounded-xl shadow bg-white dark:bg-gray-800
${plan.popular ? "ring-2 ring-emerald-500":""}`}
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
onClick={()=>handleCheckout(plan.stripePriceId)}
className="bg-emerald-500 w-full text-white py-3 rounded-lg"
>
Start Free Trial
</button>

</motion.div>

))}

</div>

</section>

{/* FAQ */}

<section id="faq" className="py-20 bg-gray-100 dark:bg-gray-800">

<h2 className="text-3xl text-center font-bold mb-10">
FAQ
</h2>

<div className="max-w-3xl mx-auto">

{faqs.map((f,i)=>(
<div key={i} className="border-b py-4">

<button
className="w-full text-left font-medium"
onClick={()=>setFaqOpen(faqOpen===i?null:i)}
>
{f.q}
</button>

<AnimatePresence>

{faqOpen===i &&(

<motion.div
initial={{height:0,opacity:0}}
animate={{height:"auto",opacity:1}}
exit={{height:0,opacity:0}}
className="text-gray-500 mt-2"
>
{f.a}
</motion.div>

)}

</AnimatePresence>

</div>
))}

</div>

</section>

{/* CONTACT */}

<section className="py-20 max-w-4xl mx-auto px-6">

<h2 className="text-3xl text-center font-bold mb-10">
Contact Us
</h2>

<form className="grid gap-4">

<input placeholder="Name" className="p-3 border rounded"/>

<input placeholder="Email" className="p-3 border rounded"/>

<input placeholder="Phone" className="p-3 border rounded"/>

<textarea placeholder="Message" className="p-3 border rounded"/>

<button className="bg-emerald-500 text-white py-3 rounded">
Send Message
</button>

</form>

</section>

{/* FOOTER */}

<footer className="py-10 text-center border-t">

<p className="text-sm">
© {new Date().getFullYear()} ShopSys. All rights reserved.
</p>

</footer>

{/* FLOATING CHAT */}

<a
href="#"
className="fixed bottom-6 right-6 bg-emerald-500 p-4 rounded-full shadow-lg"
>
<MessageCircle className="text-white"/>
</a>

{/* DEMO MODAL */}

<AnimatePresence>

{demoOpen &&(

<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
exit={{opacity:0}}
className="fixed inset-0 bg-black/60 flex items-center justify-center"
>

<motion.div
initial={{scale:0.8}}
animate={{scale:1}}
exit={{scale:0.8}}
className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-2xl w-full"
>

<button
onClick={()=>setDemoOpen(false)}
className="mb-4"
>
Close
</button>

<div className="aspect-video">

<iframe
className="w-full h-full"
src="https://www.youtube.com/embed/dQw4w9WgXcQ"
title="Demo"
/>

</div>

</motion.div>

</motion.div>

)}

</AnimatePresence>

</div>
);
}