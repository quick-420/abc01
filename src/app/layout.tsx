
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/theme-provider";
import { LanguageProvider } from "@/context/language-provider"; // Added

export const metadata: Metadata = {
  title: 'Hygienea',
  description: 'Connecting Doctors and Patients Seamlessly',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider
          storageKey="hygienea-theme"
          defaultTheme="system"
        >
          <LanguageProvider storageKey="hygienea-language" defaultLanguage="en"> {/* Added */}
            {children}
            <Toaster />
          </LanguageProvider> {/* Added */}
        </ThemeProvider>
      </body>
    </html>
  );
}
