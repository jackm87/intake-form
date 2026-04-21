"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: "4", label: "Templates available" },
  { value: "60s", label: "Average setup time" },
  { value: "0", label: "Manual data entry" },
  { value: "100%", label: "Browser-based" },
];

function StatItem({
  stat,
  index,
}: {
  stat: { value: string; label: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="flex flex-col items-center gap-1.5 text-center">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
        className="text-3xl font-bold text-sky-400"
      >
        {stat.value}
      </motion.span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1 + index * 0.08, ease: "easeOut" }}
        className="text-sm text-zinc-400"
      >
        {stat.label}
      </motion.span>
    </div>
  );
}

export default function StatsBand() {
  return (
    <section
      className="py-14 px-6 border-y border-white/8"
      style={{ backgroundColor: "#111318" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
