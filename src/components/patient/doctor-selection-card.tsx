import type { Doctor } from "@/lib/placeholder-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Star, CalendarDays } from "lucide-react";

interface DoctorSelectionCardProps {
  doctor: Doctor;
  onSelectDoctor: (doctorId: string) => void;
}

export function DoctorSelectionCard({ doctor, onSelectDoctor }: DoctorSelectionCardProps) {
  const doctorInitials = doctor.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'DR';
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="bg-secondary aspect-[3/1] flex items-center justify-center">
           <Avatar className="h-24 w-24 border-4 border-background shadow-md">
            <AvatarImage src={doctor.avatarUrl || `https://placehold.co/150x150.png?text=${doctorInitials}`} alt={doctor.name} data-ai-hint="doctor portrait" />
            <AvatarFallback>{doctorInitials}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="p-4 text-center">
        <CardTitle className="text-xl font-headline mt-2">{doctor.name}</CardTitle>
        <CardDescription className="text-primary">{doctor.specialization}</CardDescription>
        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> {doctor.rating.toFixed(1)}
        </div>
        <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
            <MapPin className="h-4 w-4" /> {doctor.location}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button className="w-full" variant="default" onClick={() => onSelectDoctor(doctor.id)}>
          <CalendarDays className="mr-2 h-4 w-4" /> Select & View Availability
        </Button>
      </CardFooter>
    </Card>
  );
}
