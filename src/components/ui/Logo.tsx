import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

const sizes = {
  sm: { icon: "w-5 h-5", iconInner: 12, text: "text-sm" },
  md: { icon: "w-7 h-7", iconInner: 16, text: "text-xl" },
  lg: { icon: "w-8 h-8", iconInner: 18, text: "text-2xl" },
};

export function Logo({ size = "sm", href = "/", className = "" }: LogoProps) {
  const s = sizes[size];
  const inner = (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className={`${s.icon} rounded-md bg-emerald-500 flex items-center justify-center flex-shrink-0`}>
        <svg width={s.iconInner} height={s.iconInner} viewBox="0 0 14 14" fill="none">
          <path d="M2 4h10M2 7h7M2 10h5" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </span>
      <span className={`${s.text} font-bold text-zinc-50 tracking-tight`}>FormFlow</span>
    </span>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}
