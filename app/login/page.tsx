import { Header } from "@/components/header"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-16 px-4">
        <LoginForm />
      </main>
    </div>
  )
}
