"use client";

import { cn } from "@/global/lib/utils";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV } from "../_consts";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <aside className="w-64 bg-background shadow-sm min-h-screen">
          <div className="p-6 border-b">
            <Link href={"/admin"}>
              <h1 className="text-xl font-bold">관리자 페이지</h1>
            </Link>
          </div>
          <nav className="p-4 space-y-1">
            {NAV.map((n) => {
              const active = pathname?.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-sm transition-colors",
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
