import { MatchingDashboard } from "./_components/MatchingDashboard";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">대시보드</h1>
        <p className="text-muted-foreground">
          프로젝트 현황과 매칭 정보를 한눈에 확인하세요
        </p>
      </div>
      <MatchingDashboard />
    </div>
  );
}
