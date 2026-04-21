"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Settings, Share2, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  orgName: string;
  orgLogo: string | null;
}

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Submissions", href: "/dashboard/submissions", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Share", href: "/dashboard/share", icon: Share2 },
];

export function Sidebar({ orgName, orgLogo }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const initials = orgName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      className="w-56 flex-shrink-0 flex flex-col border-r border-white/8"
      style={{ background: "#111318" }}
    >
      {/* Org header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/8">
        {orgLogo ? (
          <img
            src={orgLogo}
            alt={orgName}
            className="w-8 h-8 rounded-md object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-semibold text-white"
            style={{ background: "var(--sky)" }}>
            {initials}
          </div>
        )}
        <span className="text-sm font-semibold text-sky-400 truncate leading-tight">
          {orgName}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                isActive
                  ? "bg-white/8 text-white font-medium"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <Icon size={16} className={isActive ? "text-sky-400" : "text-zinc-500"} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-2 pb-4 border-t border-white/8 pt-4">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-all duration-150 w-full"
        >
          <LogOut size={16} className="text-zinc-500" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
