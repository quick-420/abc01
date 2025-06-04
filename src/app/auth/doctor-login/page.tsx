import { AuthFormCard } from "@/components/auth/auth-form-card";
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function DoctorLoginPage() {
  return (
    <AuthFormCard
      title="Doctor Login"
      description="Access your MediLink Hub doctor dashboard."
      footerContent={
        <>
          Don't have an account?{" "}
          <Link href="/auth/doctor-register" className="font-medium text-primary hover:underline">
            Register here
          </Link>
        </>
      }
    >
      <LoginForm userType="doctor" />
    </AuthFormCard>
  );
}
