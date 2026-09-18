"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";

const navigationItems = [
  {
    href: "/",
    label: "Tableau de bord",
  },
  {
    href: "/prospects",
    label: "Prospects",
  },
  {
    href: "/automatisations",
    label: "Automatisations",
  },
  {
    href: "/parametres",
    label: "Paramètres",
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-sm font-bold text-foreground">
            LBR
          </span>

          <span className="text-lg font-bold text-foreground">
            La Bonne Relance
          </span>
        </Link>

        <nav
          aria-label="Navigation principale"
          className="flex gap-1 overflow-x-auto"
        >
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-accent-soft text-primary-hover"
                    : "text-muted hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <form action={signOut}>
  <button
    type="submit"
    className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-muted)]"
  >
    Se déconnecter
  </button>
</form>
      </div>
    </header>
  );
}