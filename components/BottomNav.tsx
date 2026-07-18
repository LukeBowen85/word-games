"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Clock3,
  Home,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  primary?: boolean;
};

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Record",
    href: "/record",
    icon: Plus,
    primary: true,
  },
  {
    label: "Stats",
    href: "/stats",
    icon: BarChart3,
  },
  {
    label: "History",
    href: "/history",
    icon: Clock3,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
                <nav
        aria-label="Primary navigation"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-[clamp(1rem,6vw,2rem)] pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
        >
        <div className="pointer-events-auto mx-auto grid w-full max-w-[30rem] grid-cols-4 place-items-center rounded-2xl border border-white/10 bg-[#161b22]/95 px-3 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl">      
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)] text-[#0b0e13] shadow-[0_8px_24px_rgba(247,181,0,0.3)] transition-transform active:scale-90"
              >
                <Icon size={27} strokeWidth={2.75} />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-all active:scale-90 ${
                isActive
                  ? "text-white"
                  : "text-[var(--muted)]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-nav"
                  className="absolute inset-0 rounded-xl bg-white/8"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                  }}
                />
              )}

              <Icon
                className="relative z-10"
                size={22}
                strokeWidth={isActive ? 2.6 : 2.1}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}