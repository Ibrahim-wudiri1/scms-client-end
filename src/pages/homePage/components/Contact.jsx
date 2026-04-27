import React, { useState } from "react";

export default function Contact() {

const [form, setForm] = useState({
name:"",
email:"",
phone:"",
message:""
});

const [errors, setErrors] = useState({});
const [success, setSuccess] = useState(false);

const validate = () => {
let newErrors = {};

if (!form.name) newErrors.name = "Name is required";
if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
newErrors.email = "Valid email required";
if (!form.message) newErrors.message = "Message required";

return newErrors;
};

const handleSubmit = (e) => {
e.preventDefault();

const validation = validate();

if (Object.keys(validation).length > 0) {
setErrors(validation);
return;
}

setErrors({});
setSuccess(true);
};

return (
<section className="py-20 max-w-4xl mx-auto px-6">

<h2 className="text-3xl text-center font-bold mb-10">
Contact Us
</h2>

<form onSubmit={handleSubmit} className="grid gap-4">

<input
placeholder="Name"
value={form.name}
onChange={(e)=>setForm({...form, name:e.target.value})}
className="p-3 border rounded"
/>
{errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

<input
placeholder="Email"
value={form.email}
onChange={(e)=>setForm({...form, email:e.target.value})}
className="p-3 border rounded"
/>
{errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

<input
placeholder="Phone"
value={form.phone}
onChange={(e)=>setForm({...form, phone:e.target.value})}
className="p-3 border rounded"
/>

<textarea
placeholder="Message"
value={form.message}
onChange={(e)=>setForm({...form, message:e.target.value})}
className="p-3 border rounded"
/>
{errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}

<button className="bg-emerald-500 text-white py-3 rounded">
Send Message
</button>

{success && (
<p className="text-green-500 text-center mt-4">
Message sent successfully!
</p>
)}

</form>

<div className="text-center mt-8">
<a href="#signup" className="underline">
Or book a quick demo
</a>
</div>

</section>
);
}