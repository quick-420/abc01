
"use client";

import type { ReactNode } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/context/language-provider";
// Removed: import { translateText, type TranslateTextInput } from "@/ai/flows/translate-text-flow";
// Removed: import { Skeleton } from '@/components/ui/skeleton';

interface FAQItem {
  id: string;
  questionKey: string;
  answerKey: string;
}

const faqItems: FAQItem[] = [
  {
    id: "q1",
    questionKey: "faq.q1.question",
    answerKey: "faq.q1.answer"
  },
  {
    id: "q2",
    questionKey: "faq.q2.question",
    answerKey: "faq.q2.answer"
  },
  {
    id: "q3",
    questionKey: "faq.q3.question",
    answerKey: "faq.q3.answer"
  },
  {
    id: "q4",
    questionKey: "faq.q4.question",
    answerKey: "faq.q4.answer"
  },
  {
    id: "q5",
    questionKey: "faq.q5.question",
    answerKey: "faq.q5.answer"
  },
  {
    id: "q6",
    questionKey: "faq.q6.question",
    answerKey: "faq.q6.answer"
  }
];

export default function FAQPage() {
  const { t } = useLanguage();
  // Removed useState for translatedFaqs and isLoading related to dynamic translation

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-headline text-primary">
              {t('faq.title', 'Frequently Asked Questions')}
            </CardTitle>
            <CardDescription>
              {t('faq.description', 'Find answers to common questions about MediLink Hub.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem value={item.id} key={item.id}>
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {t(item.questionKey)}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t(item.answerKey)}
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
