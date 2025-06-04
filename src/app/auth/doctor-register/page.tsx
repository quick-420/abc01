import { AuthFormCard } from "@/components/auth/auth-form-card";
import { DoctorRegisterForm } from "@/components/auth/doctor-register-form";
import Link from "next/link";

export default function DoctorRegisterPage() {
  return (
    <AuthFormCard
      title="Doctor Registration"
      description="Create your MediLink Hub professional profile."
      footerContent={
        <>
          Already have an account?{" "}
          <Link href="/auth/doctor-login" className="font-medium text-primary hover:underline">
            Log in here
          </Link>
        </>
      }
    >
      <DoctorRegisterForm />
    </AuthFormCard>
  );
}
