import { mockAppointments, mockPatients } from "@/lib/placeholder-data";
import { AppointmentListItem } from "@/components/doctor/appointment-list-item";
import { PatientListItem } from "@/components/doctor/patient-list-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, CalendarCheck } from "lucide-react";
import Link from "next/link";

export default function DoctorDashboardPage() {
  const upcomingAppointments = mockAppointments.filter(a => a.status === 'Scheduled' && a.patientName).slice(0, 3);
  const recentPatients = mockPatients.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. Emily Carter!</p>
        </div>
        {/* Placeholder for potential actions like "Add Availability" */}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <CalendarCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today and tomorrow
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPatients.length}</div>
            <p className="text-xs text-muted-foreground">
              Under your care
            </p>
          </CardContent>
        </Card>
         <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Manage Profile</CardTitle>
            <PlusCircle className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">
              Keep your information up to date for patients.
            </p>
            <Button variant="outline" size="sm" asChild className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
              <Link href="/doctor/profile">Update Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments Section */}
      <section id="appointments">
        <h2 className="text-2xl font-headline font-semibold mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingAppointments.map(app => (
              <AppointmentListItem key={app.id} appointment={app} />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No upcoming appointments.</p>
          </Card>
        )}
      </section>

      {/* Recent Patients Section */}
      <section id="patients">
        <h2 className="text-2xl font-headline font-semibold mb-4">Recent Patients</h2>
        {recentPatients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPatients.map(patient => (
              <PatientListItem key={patient.id} patient={patient} />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No patient data available.</p>
          </Card>
        )}
         <div className="mt-6 text-center">
            <Button variant="outline">View All Patients</Button>
        </div>
      </section>
    </div>
  );
}
