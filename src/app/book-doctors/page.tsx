
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Stethoscope, UserPlus, LogIn } from "lucide-react";

export default function BookDoctorsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <Stethoscope className="h-16 w-16 mx-auto text-primary mb-4" />
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary">
                Find and Book Your Doctor
              </CardTitle>
              <CardDescription className="text-lg">
                Easily find available doctors and schedule your appointments with Hygienea.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-muted-foreground">
                To book an appointment, you need to be logged in as a patient. If you don't have an account, please register first.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button size="lg" asChild variant="default">
                  <Link href="/auth/patient-login">
                    <LogIn className="mr-2 h-5 w-5" /> Login as Patient
                  </Link>
                </Button>
                <Button size="lg" asChild variant="outline">
                  <Link href="/auth/patient-register">
                    <UserPlus className="mr-2 h-5 w-5" /> Register as Patient
                  </Link>
                </Button>
              </div>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Already logged in?
                </p>
                <Button size="lg" asChild variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  <Link href="/patient/book-appointment">
                    Proceed to Book Appointment
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
