
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Fab } from "@/components/layout/fab";
import Link from "next/link";
import { CheckCircle, User, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { HeroSlideshow } from "@/components/home/hero-slideshow";

const features = [
  {
    title: "Doctor Registration & Profiles",
    description: "Doctors can easily register, create detailed profiles, and list their specializations.",
    icon: <Stethoscope className="h-8 w-8 text-primary" />
  },
  {
    title: "Patient Registration & History",
    description: "Patients can sign up, manage personal information, and securely store their medical history.",
    icon: <User className="h-8 w-8 text-primary" />
  },
  {
    title: "Seamless Appointment Booking",
    description: "An intuitive system for patients to find doctors and book appointments effortlessly.",
    icon: <CheckCircle className="h-8 w-8 text-primary" />
  },
  {
    title: "Dedicated Dashboards",
    description: "Personalized dashboards for both doctors and patients to manage schedules and access information.",
    icon: <CheckCircle className="h-8 w-8 text-primary" />
  }
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Slideshow Section with Overlay Content */}
        <section>
          <HeroSlideshow />
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              Platform <span className="text-primary">Features</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="items-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4">
                       {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-center font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
                Join Our <span className="text-primary">Newsletter</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Stay informed about our latest special offers, upcoming health check-up camps, blood donation drives, and other important community health news from Hygienea.
              </p>
            </div>
            <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow w-full sm:w-auto"
                aria-label="Email for newsletter"
                required
              />
              <Button type="submit" variant="default" size="lg" className="w-full sm:w-auto">
                Subscribe
              </Button>
            </form>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg md:text-xl opacity-90 mb-10 max-w-xl mx-auto">
              Join Hygienea today and experience a new era of healthcare management.
            </p>
            <Button size="lg" variant="secondary" asChild className="bg-background text-primary hover:bg-background/90">
              <Link href="/auth/patient-register">Register Now</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <Fab href="/book-doctors" tooltipText="Book a Doctor" />
    </div>
  );
}
