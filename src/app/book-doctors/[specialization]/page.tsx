
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockDoctors } from "@/lib/placeholder-data";
import type { Doctor } from "@/lib/placeholder-data";
import { DoctorSelectionCard } from "@/components/patient/doctor-selection-card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DoctorsBySpecializationPage() {
  const router = useRouter();
  const params = useParams();
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [specializationName, setSpecializationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (params.specialization) {
      const specName = decodeURIComponent(params.specialization as string);
      setSpecializationName(specName);
      const doctors = mockDoctors.filter(
        (doctor) => doctor.specialization.toLowerCase() === specName.toLowerCase()
      );
      setFilteredDoctors(doctors);
    }
    setIsLoading(false);
  }, [params.specialization]);

  const handleSelectDoctor = (doctorId: string) => {
    router.push(`/patient/book-appointment?doctorId=${doctorId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <Button variant="outline" onClick={() => router.push('/book-doctors')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Specializations
        </Button>
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-headline text-primary">
              {specializationName} Doctors
            </CardTitle>
            <CardDescription className="text-lg">
              Browse and select a doctor specializing in {specializationName.toLowerCase()}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <DoctorSelectionCard
                    key={doctor.id}
                    doctor={doctor}
                    onSelectDoctor={handleSelectDoctor}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">
                  No doctors found for "{specializationName}".
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please try a different specialization or check back later.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

    