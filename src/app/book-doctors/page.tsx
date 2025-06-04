
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Smile, Leaf, Accessibility, Beaker, MonitorSmartphone, Activity, Brain, Stethoscope, UserPlus, LogIn } from "lucide-react";

const specializations = [
  { name: "Dentist", icon: <Smile className="h-10 w-10 text-primary" />, description: "Dental care and oral hygiene." },
  { name: "Homeopathic Doctor", icon: <Leaf className="h-10 w-10 text-primary" />, description: "Holistic and natural remedies." },
  { name: "Ayurvedic Doctor", icon: <Leaf className="h-10 w-10 text-primary" />, description: "Traditional Indian medicine." },
  { name: "Physiotherapist", icon: <Accessibility className="h-10 w-10 text-primary" />, description: "Physical rehabilitation and therapy." },
  { name: "Lab Technician", icon: <Beaker className="h-10 w-10 text-primary" />, description: "Diagnostic tests and lab services." },
  { name: "Health Tech", icon: <MonitorSmartphone className="h-10 w-10 text-primary" />, description: "Telehealth and tech-assisted services." },
  { name: "ECG Services", icon: <Activity className="h-10 w-10 text-primary" />, description: "Heart monitoring and diagnostics." },
  { name: "Neurologist", icon: <Brain className="h-10 w-10 text-primary" />, description: "Nervous system disorders." },
];

export default function BookDoctorsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <Stethoscope className="h-16 w-16 mx-auto text-primary mb-4" />
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary">
                Choose a Service or Specialization
              </CardTitle>
              <CardDescription className="text-lg">
                Select a category below to find the right healthcare professional or service for your needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {specializations.map((spec) => (
                  <Card key={spec.name} className="hover:shadow-xl transition-shadow text-center">
                    <CardHeader className="items-center">
                      <div className="p-3 rounded-full bg-primary/10 mb-3">
                        {spec.icon}
                      </div>
                      <CardTitle className="text-lg font-headline">{spec.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{spec.description}</p>
                    </CardContent>
                    {/* <CardFooter className="p-4">
                      <Button className="w-full" variant="outline">Select</Button>
                    </CardFooter> */}
                  </Card>
                ))}
              </div>
              <div className="pt-8 border-t mt-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Alternatively, if you already know what you need or want to see all doctors:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
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
                 <div className="mt-6">
                    <Button size="lg" asChild variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    <Link href="/patient/book-appointment">
                        Proceed to General Booking
                    </Link>
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
