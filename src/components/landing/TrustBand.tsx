"use client";

const companies = [
  "Lakewood Tax Group", "Summit Insurance", "Meridian Health",
  "Hargrove Legal", "Clearfield Financial", "Northpoint Tax Advisors",
  "Atlas Insurance Group", "Riverstone Law", "Crestview Medical", "Pacific Tax Partners",
];

export default function TrustBand() {
  const items = [...companies, ...companies];

  return (
    <section className="border-y border-zinc-200 dark:border-white/6 py-8 overflow-hidden" style={{ backgroundColor: "var(--bg)" }}>
      <div className="mb-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">
          Trusted by practices across the country
        </p>
      </div>

      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {items.map((name, i) => (
            <span key={i} className="mx-10 text-sm font-semibold tracking-tight text-emerald-500 flex-shrink-0">
              {name}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>
    </section>
  );
}
