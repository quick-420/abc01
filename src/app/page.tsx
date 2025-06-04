
"use client"; // Make this a client component to use the useLanguage hook

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Fab } from "@/components/layout/fab";
import Link from "next/link";
import { CheckCircle, User, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { HeroSlideshow } from "@/components/home/hero-slideshow";
import { useLanguage } from "@/context/language-provider"; // Added

const featuresData = [ // Renamed to avoid conflict with 'features' variable name
  {
    icon: <Stethoscope className="h-8 w-8 text-primary" />,
    titleKey: "home.feature1.title",
    descriptionKey: "home.feature1.description"
  },
  {
    icon: <User className="h-8 w-8 text-primary" />,
    titleKey: "home.feature2.title",
    descriptionKey: "home.feature2.description"
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    titleKey: "home.feature3.title",
    descriptionKey: "home.feature3.description"
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    titleKey: "home.feature4.title",
    descriptionKey: "home.feature4.description"
  }
];

export default function HomePage() {
  const { t } = useLanguage(); // Added

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Slideshow Section with Overlay Content */}
        <section>
          <HeroSlideshow 
            title={t("home.welcome.title")}
            description={t("home.welcome.description")}
            patientButtonText={t("home.button.patient")}
            doctorButtonText={t("home.button.doctor")}
          />
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              {t("home.features.title").replace(t("home.features.title.highlight"), "")} {/* Main part */}
              <span className="text-primary">{t("home.features.title.highlight")}</span> {/* Highlighted part */}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuresData.map((feature, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="items-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4">
                       {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-center font-headline">{t(feature.titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">{t(feature.descriptionKey)}</p>
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
                {t("home.newsletter.title").replace(t("home.newsletter.title.highlight"), "")}
                <span className="text-primary">{t("home.newsletter.title.highlight")}</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t("home.newsletter.description")}
              </p>
            </div>
            <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
              <Input
                type="email"
                placeholder={t("home.newsletter.email.placeholder")}
                className="flex-grow w-full sm:w-auto"
                aria-label="Email for newsletter"
                required
              />
              <Button type="submit" variant="default" size="lg" className="w-full sm:w-auto">
                {t("home.newsletter.button.subscribe")}
              </Button>
            </form>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">{t("home.cta.title")}</h2>
            <p className="text-lg md:text-xl opacity-90 mb-10 max-w-xl mx-auto">
              {t("home.cta.description")}
            </p>
            <Button size="lg" variant="secondary" asChild className="bg-background text-primary hover:bg-background/90">
              <Link href="/auth/patient-register">{t("home.cta.button.register")}</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <Fab href="/book-doctors" tooltipText="Book a Doctor" />
    </div>
  );
}
