import type { ReactNode } from "react";
import Navigation from "@/components/navigation";

type ApplicationLayoutProps = {
  children: ReactNode;
};

export default function ApplicationLayout({
  children,
}: ApplicationLayoutProps) {
  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}