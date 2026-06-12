import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1F1F1E] px-4">
      <div className="w-full max-w-sm bg-[#2A2A29] border border-[#3A3A39] rounded-xl p-6">
        <h1 className="text-xl font-semibold text-[#F0EFED] mb-1">Welcome back</h1>
        <p className="text-sm text-[#9B9B99] mb-6">Sign in to continue</p>
        <LoginForm />
      </div>
    </div>
  );
}
