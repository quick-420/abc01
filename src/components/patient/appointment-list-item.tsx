import type { Appointment } from "@/lib/placeholder-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Stethoscope, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AppointmentListItemProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
}

export function AppointmentListItem({ appointment, onCancel, onReschedule }: AppointmentListItemProps) {
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
          <Stethoscope className="h-4 w-4" /> {appointment.doctorName || "N/A"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{appointment.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{appointment.time}</span>
        </div>
        {appointment.status === 'Scheduled' && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onReschedule?.(appointment.id)} className="flex-1">
              <Edit className="mr-2 h-3 w-3" /> Reschedule
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onCancel?.(appointment.id)} className="flex-1">
              <Trash2 className="mr-2 h-3 w-3" /> Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
