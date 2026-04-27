import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero3D from "./components/Hero3D";
import Metrics from "./components/Metrics";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
// import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import DemoModal from "./components/DemoModal";

export default function App() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <Navbar />
      <Hero3D setDemoOpen={setDemoOpen} />
      <Metrics />
      <Features />
      <Pricing />
      <FAQ />
      <Contact />
      {/* <Footer /> */}
      <Chatbot />
      <DemoModal open={demoOpen} setOpen={setDemoOpen} />
    </div>
  );
}