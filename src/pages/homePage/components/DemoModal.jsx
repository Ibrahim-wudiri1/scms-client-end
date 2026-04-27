import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DemoModal({ open, setOpen }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <motion.div className="bg-white p-6 rounded-xl">
            <button onClick={() => setOpen(false)}>Close</button>

            <iframe
              width="400"
              height="250"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}