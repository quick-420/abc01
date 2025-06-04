import type { Patient } from "@/lib/placeholder-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, CalendarDays } from "lucide-react";
import Link from "next/link";

interface PatientListItemProps {
  patient: Patient;
}

export function PatientListItem({ patient }: PatientListItemProps) {
  const patientInitials = patient.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'P';
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={patient.avatarUrl || `https://placehold.co/100x100.png?text=${patientInitials}`} alt={patient.name} data-ai-hint="patient photo" />
          <AvatarFallback>{patientInitials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl font-headline">{patient.name}</CardTitle>
          <CardDescription>Age: {patient.age}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{patient.email}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{patient.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>Last Visit: {patient.lastVisit}</span>
        </div>
        <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
          <Link href={`/doctor/patients/${patient.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
