import type { Appointment } from "@/lib/placeholder-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AppointmentListItemProps {
  appointment: Appointment;
}

export function AppointmentListItem({ appointment }: AppointmentListItemProps) {
  const patientInitials = appointment.patientName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'P';
  
  let statusVariant: "default" | "secondary" | "destructive" | "outline" = "default";
  if (appointment.status === "Completed") statusVariant = "secondary";
  if (appointment.status === "Cancelled") statusVariant = "destructive";


  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-headline">{appointment.reason || "Appointment"}</CardTitle>
          <Badge variant={statusVariant}>{appointment.status}</Badge>
        </div>
        <CardDescription className="flex items-center gap-2 pt-1">
          <User className="h-4 w-4" /> {appointment.patientName || "N/A"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://placehold.co/40x40.png?text=${patientInitials}`} alt={appointment.patientName} data-ai-hint="patient avatar" />
            <AvatarFallback>{patientInitials}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{appointment.patientName}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{appointment.date}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{appointment.time}</span>
        </div>
      </CardContent>
    </Card>
  );
}
