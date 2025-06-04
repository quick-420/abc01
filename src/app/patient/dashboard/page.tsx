"use client";

import { mockAppointments, mockMedicalRecords } from "@/lib/placeholder-data";
import { AppointmentListItem } from "@/components/patient/appointment-list-item";
import { MedicalRecordItem } from "@/components/patient/medical-record-item";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CalendarCheck, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function PatientDashboardPage() {
  const { toast } = useToast();
  const upcomingAppointments = mockAppointments.filter(a => a.status === 'Scheduled' && a.doctorName).slice(0, 3);
  const recentRecords = mockMedicalRecords.slice(0,2);

  const handleCancelAppointment = (id: string) => {
    toast({ title: "Appointment Cancelled", description: `Appointment ID ${id} has been cancelled.` });
    // Placeholder: Add logic to update appointment status
  };

  const handleRescheduleAppointment = (id: string) => {
    toast({ title: "Reschedule Requested", description: `Reschedule for Appointment ID ${id}. You will be contacted.` });
    // Placeholder: Add logic for rescheduling
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Patient Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Alice!</p>
        </div>
        <Button asChild variant="default">
          <Link href="/patient/book-appointment"><PlusCircle className="mr-2 h-4 w-4" /> Book New Appointment</Link>
        </Button>
      </div>

      {/* Quick Stats / Actions */}
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <CalendarCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Manage your scheduled visits
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMedicalRecords.length}</div>
            <p className="text-xs text-muted-foreground">
              Access your health history
            </p>
          </CardContent>
        </Card>
         <Card className="bg-accent/10 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-accent-foreground">Need Help?</CardTitle>
            <PlusCircle className="h-5 w-5 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">
              Find answers or contact support.
            </p>
            <Button variant="outline" size="sm" className="border-accent text-accent-foreground hover:bg-accent/20">
              Support Center
            </Button>
          </CardContent>
        </Card>
      </div>


      {/* Upcoming Appointments Section */}
      <section id="appointments">
        <h2 className="text-2xl font-headline font-semibold mb-4">Your Upcoming Appointments</h2>
        {upcomingAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingAppointments.map(app => (
              <AppointmentListItem 
                key={app.id} 
                appointment={app} 
                onCancel={handleCancelAppointment}
                onReschedule={handleRescheduleAppointment}
              />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No upcoming appointments. Ready to book one?</p>
            <Button asChild className="mt-4" variant="default">
              <Link href="/patient/book-appointment">Book Appointment</Link>
            </Button>
          </Card>
        )}
      </section>

      {/* Medical Records Section */}
      <section id="records">
        <h2 className="text-2xl font-headline font-semibold mb-4">Recent Medical Records</h2>
        {recentRecords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentRecords.map(record => (
              <MedicalRecordItem key={record.id} record={record} />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No medical records found.</p>
          </Card>
        )}
        <div className="mt-6 text-center">
            <Button variant="outline">View All Medical Records</Button>
        </div>
      </section>
    </div>
  );
}
