
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AuthFormCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footerContent?: ReactNode;
}

export function AuthFormCard({ title, description, children, footerContent }: AuthFormCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md shadow-xl relative">
        <Link href="/" passHref legacyBehavior>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"
            aria-label="Back to homepage"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <CardHeader className="text-center pt-12"> {/* Added pt-12 to make space for the back button */}
          <CardTitle className="text-3xl font-headline">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          {footerContent && (
            <div className="mt-6 text-center text-sm">
              {footerContent}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
