import { AuthFormCard } from "@/components/auth/auth-form-card";
import { PatientRegisterForm } from "@/components/auth/patient-register-form";
import Link from "next/link";

export default function PatientRegisterPage() {
  return (
    <AuthFormCard
      title="Patient Registration"
      description="Join Hygienea to manage your health."
      footerContent={
        <>
          Already have an account?{" "}
          <Link href="/auth/patient-login" className="font-medium text-primary hover:underline">
            Log in here
          </Link>
        </>
      }
    >
      <PatientRegisterForm />
    </AuthFormCard>
  );
}
