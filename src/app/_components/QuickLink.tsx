import { Button } from "@/global/components/ui/button";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

export function QuickLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Button asChild variant="secondary" className="w-full justify-start">
      <Link href={href} className="flex w-full items-center justify-between">
        <span className="flex items-center gap-2">
          {icon}
          {children}
        </span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}
