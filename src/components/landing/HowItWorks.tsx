import { LayoutTemplate, Link2, BarChart2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const steps: { number: string; Icon: LucideIcon; title: string; description: string }[] = [
  {
    number: "01",
    Icon: LayoutTemplate,
    title: "Pick a template",
    description:
      "Choose from Tax, Insurance, Health, or Legal. Customize fields and branding to match your business.",
  },
  {
    number: "02",
    Icon: Link2,
    title: "Share your link",
    description:
      "Get a unique link to share with your clients via email, SMS, or QR code. No login required for them.",
  },
  {
    number: "03",
    Icon: BarChart2,
    title: "Watch submissions roll in",
    description:
      "Your dashboard shows every submission in real time, ready to export or review.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 px-6"
      style={{ backgroundColor: "#0d0e12" }}
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          How it works
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-50 mb-16 max-w-lg">
          Set up in minutes. Results immediately.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col gap-4">
              <span className="text-4xl font-bold text-sky-400/30 leading-none">
                {step.number}
              </span>
              <step.Icon className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-zinc-50">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
