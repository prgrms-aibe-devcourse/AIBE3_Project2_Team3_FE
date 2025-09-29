import { ProfileForm } from "@/components/profile/profile-form"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">프로필 관리</h1>
        <p className="text-muted-foreground">프로필 정보를 업데이트하여 더 많은 프로젝트 기회를 얻으세요</p>
      </div>
      <ProfileForm />
    </div>
  )
}
