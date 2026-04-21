"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FeaturesGrid } from "@/components/ui/features-8";
import type React from "react";

type AnimatedContainerProps = {
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

function AnimatedContainer({ className, style, delay = 0.1, children }: AnimatedContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return <div className={className} style={style}>{children}</div>;

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#111318" }}>
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <AnimatedContainer className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
            Features
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-50 mb-3">
            Everything you need to automate intake
          </h2>
          <p className="text-sm text-zinc-400">
            Built for practices that want to spend less time on paperwork and more time on clients.
          </p>
        </AnimatedContainer>

        <AnimatedContainer delay={0.3}>
          <FeaturesGrid />
        </AnimatedContainer>
      </div>
    </section>
  );
}
