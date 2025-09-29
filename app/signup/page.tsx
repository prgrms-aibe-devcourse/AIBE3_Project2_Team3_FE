import { Header } from "@/components/header"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-16 px-4">
        <SignupForm />
      </main>
    </div>
  )
}
