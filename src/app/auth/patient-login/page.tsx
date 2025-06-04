import { AuthFormCard } from "@/components/auth/auth-form-card";
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function PatientLoginPage() {
  return (
    <AuthFormCard
      title="Patient Login"
      description="Access your MediLink Hub patient portal."
      footerContent={
        <>
          Don't have an account?{" "}
          <Link href="/auth/patient-register" className="font-medium text-primary hover:underline">
            Register here
          </Link>
        </>
      }
    >
      <LoginForm userType="patient" />
    </AuthFormCard>
  );
}
