import { Card, CardContent } from "@/global/components/ui/card";

export function StepCard({
  color,
  step,
  title,
  desc,
  icon,
}: {
  color: string;
  step: number;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="h-full rounded-2xl border bg-card shadow-sm">
      <CardContent className="flex h-full flex-col items-center gap-3 p-8 text-center">
        <StepIcon className={color}>{icon}</StepIcon>
        <StepBadge>{step}</StepBadge>
        <div className="mt-1 text-base font-semibold">{title}</div>
        <p className="text-sm leading-6 text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

function StepIcon({
  children,
  className = "from-blue-500 to-indigo-500",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${className} shadow-sm`}
    >
      {children}
    </div>
  );
}

function StepBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-pink-100 px-2 text-xs font-medium text-pink-700">
      {children}
    </span>
  );
}
