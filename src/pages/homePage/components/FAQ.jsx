import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
{
q: "Does ShopSys work offline?",
a: "Yes. You can continue selling without internet."
},
{
q: "Can I manage multiple shops?",
a: "Yes, everything is centralized in one dashboard."
},
{
q: "Is there a free trial?",
a: "Yes, 14 days free."
},
{
q: "Can I add staff?",
a: "Yes, assign roles like Manager or Cashier."
}
];

export default function FAQ() {

const [active, setActive] = useState(null);

return (
<section id="faq" className="py-20 bg-gray-100 dark:bg-gray-800">

<h2 className="text-3xl text-center font-bold mb-10">
Frequently Asked Questions
</h2>

<div className="max-w-3xl mx-auto px-6">

{faqs.map((f, i) => (

<div key={i} className="mb-4 border-b pb-4">

<button
onClick={() => setActive(active === i ? null : i)}
className="w-full text-left font-medium text-lg"
>
{f.q}
</button>

<AnimatePresence>
{active === i && (
<motion.div
initial={{ height:0, opacity:0 }}
animate={{ height:"auto", opacity:1 }}
exit={{ height:0, opacity:0 }}
transition={{ duration:0.3 }}
className="text-gray-600 dark:text-gray-300 mt-2 overflow-hidden"
>
{f.a}
</motion.div>
)}
</AnimatePresence>

</div>

))}

</div>

<div className="text-center mt-10">
<a
href="#signup"
className="bg-emerald-500 px-6 py-3 text-white rounded"
>
Start Free Trial
</a>
</div>

</section>
);
}