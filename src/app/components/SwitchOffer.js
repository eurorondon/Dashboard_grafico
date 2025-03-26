import React from "react";
import { motion } from "framer-motion";

export default function Switch({ toggle, setToggle }) {
  return (
    <div
      onClick={() => setToggle(!toggle)}
      className={`flex h-6  w-12 cursor-pointer  rounded-full border   p-[1px] ${
        toggle ? "bg-green-500 justify-end " : "bg-black justify-start"
      }`}
    >
      <motion.div
        className={`h-5 w-5 rounded-full  ${
          toggle ? "bg-gray-100" : "bg-white"
        }`}
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
      />
    </div>
  );
}
