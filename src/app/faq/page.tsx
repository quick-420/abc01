
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const faqItems = [
  {
    question: "How do I register as a patient?",
    answer: "To register as a patient, click on the 'I'm a Patient' button on the homepage, or navigate to the Patient Registration page. You'll need to provide your full name, email, date of birth, and create a password."
  },
  {
    question: "How do I register as a doctor?",
    answer: "To register as a doctor, click on the 'I'm a Doctor' button on the homepage, or navigate to the Doctor Registration page. You'll need to provide your full name, email, password, specialization, and medical license number."
  },
  {
    question: "How can I book an appointment?",
    answer: "Once logged in as a patient, navigate to the 'Book Appointment' section from your dashboard. You can then select a doctor, choose an available date and time, and confirm your booking."
  },
  {
    question: "Can I cancel or reschedule my appointment?",
    answer: "Yes, you can manage your appointments from your patient dashboard. There are options to cancel or request a reschedule for upcoming appointments, subject to the clinic's policies."
  },
  {
    question: "How is my medical data protected?",
    answer: "We take data privacy and security very seriously. All your personal and medical information is encrypted and stored securely. We comply with relevant data protection regulations to ensure your data is safe."
  },
  {
    question: "I forgot my password. What should I do?",
    answer: "On the login page, there is a 'Forgot Password?' link. Click on it and follow the instructions to reset your password. You will typically receive an email with a link to create a new password."
  }
];

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-headline text-primary">Frequently Asked Questions</CardTitle>
            <CardDescription>Find answers to common questions about Hygienea.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
