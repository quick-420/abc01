
"use client";

import type { ReactNode } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/context/language-provider";
import { translateText, type TranslateTextInput } from "@/ai/flows/translate-text-flow";
import { Skeleton } from '@/components/ui/skeleton';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const baseFaqItems: FAQItem[] = [
  {
    id: "q1",
    question: "How do I register as a patient?",
    answer: "To register as a patient, click on the 'I'm a Patient' button on the homepage, or navigate to the Patient Registration page. You'll need to provide your full name, email, date of birth, and create a password."
  },
  {
    id: "q2",
    question: "How do I register as a doctor?",
    answer: "To register as a doctor, click on the 'I'm a Doctor' button on the homepage, or navigate to the Doctor Registration page. You'll need to provide your full name, email, password, specialization, and medical license number."
  },
  {
    id: "q3",
    question: "How can I book an appointment?",
    answer: "Once logged in as a patient, navigate to the 'Book Appointment' section from your dashboard. You can then select a doctor, choose an available date and time, and confirm your booking."
  },
  {
    id: "q4",
    question: "Can I cancel or reschedule my appointment?",
    answer: "Yes, you can manage your appointments from your patient dashboard. There are options to cancel or request a reschedule for upcoming appointments, subject to the clinic's policies."
  },
  {
    id: "q5",
    question: "How is my medical data protected?",
    answer: "We take data privacy and security very seriously. All your personal and medical information is encrypted and stored securely. We comply with relevant data protection regulations to ensure your data is safe."
  },
  {
    id: "q6",
    question: "I forgot my password. What should I do?",
    answer: "On the login page, there is a 'Forgot Password?' link. Click on it and follow the instructions to reset your password. You will typically receive an email with a link to create a new password."
  }
];

interface TranslatedFAQItem extends FAQItem {
  translatedQuestion: string | ReactNode;
  translatedAnswer: string | ReactNode;
  isLoading: boolean;
}

export default function FAQPage() {
  const { language, t } = useLanguage();
  const [translatedFaqs, setTranslatedFaqs] = useState<TranslatedFAQItem[]>(
    baseFaqItems.map(item => ({
      ...item,
      translatedQuestion: item.question,
      translatedAnswer: item.answer,
      isLoading: language !== 'en',
    }))
  );

  const doTranslate = useCallback(async (text: string, targetLanguageCode: string): Promise<string> => {
    if (targetLanguageCode === 'en') {
      return text;
    }
    try {
      const input: TranslateTextInput = { text, targetLanguageCode, sourceLanguageCode: 'en' };
      const result = await translateText(input);
      return result.translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Fallback to original text on error
    }
  }, []);

  useEffect(() => {
    const translateAllFaqs = async () => {
      if (language === 'en') {
        setTranslatedFaqs(baseFaqItems.map(item => ({
          ...item,
          translatedQuestion: item.question,
          translatedAnswer: item.answer,
          isLoading: false,
        })));
        return;
      }

      // Set initial loading state for all items
      setTranslatedFaqs(prevFaqs => prevFaqs.map(faq => ({ ...faq, isLoading: true })));

      const newTranslatedFaqs = await Promise.all(
        baseFaqItems.map(async (item) => {
          const translatedQ = await doTranslate(item.question, language);
          const translatedA = await doTranslate(item.answer, language);
          return {
            ...item,
            translatedQuestion: translatedQ,
            translatedAnswer: translatedA,
            isLoading: false,
          };
        })
      );
      setTranslatedFaqs(newTranslatedFaqs);
    };

    translateAllFaqs();
  }, [language, doTranslate]);

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
              {translatedFaqs.map((item) => (
                <AccordionItem value={item.id} key={item.id}>
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {item.isLoading ? <Skeleton className="h-5 w-3/4" /> : item.translatedQuestion}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.isLoading ? (
                      <>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6 mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </>
                    ) : (
                      item.translatedAnswer
                    )}
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
