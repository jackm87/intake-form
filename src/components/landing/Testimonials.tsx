"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    stars: "★★★★★",
    quote:
      "My clients upload their W-2 and the form fills itself. I save 20 minutes per client.",
    name: "Sarah K.",
    role: "Tax Preparer, H&R Block",
  },
  {
    stars: "★★★★★",
    quote:
      "I sent the link to 50 clients in one afternoon. The OCR accuracy is genuinely impressive.",
    name: "Marcus T.",
    role: "Independent Insurance Agent",
  },
  {
    stars: "★★★★★",
    quote:
      "Replaced our paper intake forms in a day. Patients love how fast it is.",
    name: "Dr. Priya N.",
    role: "Family Medicine, Harbor Clinic",
  },
];

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="min-w-[280px] md:min-w-0 snap-start bg-[#191c23] border border-white/8 rounded-lg p-6 flex flex-col gap-4"
    >
      {/* Stars */}
      <span className="text-yellow-400 text-base leading-none">
        {testimonial.stars}
      </span>

      {/* Quote */}
      <p className="text-sm italic text-zinc-300 leading-relaxed flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Attribution */}
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-zinc-50">{testimonial.name}</span>
        <span className="text-sm text-zinc-500">{testimonial.role}</span>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-20 md:py-28 px-6"
      style={{ backgroundColor: "#0d0e12" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Labels */}
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          What our clients say
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-50 mb-12 max-w-lg">
          Trusted by businesses that handle intake
        </h2>

        {/* Cards — scrollable on mobile, grid on desktop */}
        <div className="flex md:grid md:grid-cols-3 overflow-x-auto gap-4 pb-4 snap-x snap-mandatory md:overflow-visible md:pb-0">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
