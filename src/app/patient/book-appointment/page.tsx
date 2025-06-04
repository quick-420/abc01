"use client";

import { useState } from "react";
import { mockDoctors } from "@/lib/placeholder-data";
import type { Doctor } from "@/lib/placeholder-data";
import { DoctorSelectionCard } from "@/components/patient/doctor-selection-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const availableTimeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM", "02:30 PM", "03:00 PM"
];

export default function BookAppointmentPage() {
  const { toast } = useToast();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: Select Doctor, 2: Select Date/Time, 3: Confirm

  const handleSelectDoctor = (doctorId: string) => {
    const doctor = mockDoctors.find(d => d.id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
      setStep(2);
      setSelectedDate(new Date()); // Reset date when new doctor is selected
      setSelectedTime(null); // Reset time
    }
  };

  const handleDateTimeSelection = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleConfirmBooking = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: "Incomplete Information",
        description: "Please select a doctor, date, and time.",
        variant: "destructive",
      });
      return;
    }
    // Placeholder for actual booking logic
    console.log("Booking confirmed:", {
      doctor: selectedDoctor.name,
      date: format(selectedDate, "PPP"),
      time: selectedTime,
    });
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${selectedDoctor.name} on ${format(selectedDate, "PPP")} at ${selectedTime} is confirmed.`,
      action: <CheckCircle className="text-green-500" />,
    });
    setStep(1);
    setSelectedDoctor(null);
    setSelectedDate(new Date());
    setSelectedTime(null);
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-headline font-semibold mb-6 text-center">Select a Doctor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDoctors.map(doctor => (
                <DoctorSelectionCard key={doctor.id} doctor={doctor} onSelectDoctor={handleSelectDoctor} />
              ))}
            </div>
          </>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Select Date & Time for {selectedDoctor?.name}</CardTitle>
              <CardDescription>Choose an available slot for your appointment.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                  className="rounded-md border"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-medium mb-3">Available Slots for {selectedDate ? format(selectedDate, "PPP") : 'selected date'}:</h3>
                {selectedDate ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {availableTimeSlots.map(time => (
                      <Button 
                        key={time} 
                        variant="outline" 
                        onClick={() => handleDateTimeSelection(time)}
                        disabled={!selectedDate}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                   <p className="text-muted-foreground">Please select a date to see available times.</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Confirm Your Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Review Details</AlertTitle>
                <AlertDescription>
                  <p><strong>Doctor:</strong> {selectedDoctor?.name} ({selectedDoctor?.specialization})</p>
                  <p><strong>Date:</strong> {selectedDate ? format(selectedDate, "PPP") : 'N/A'}</p>
                  <p><strong>Time:</strong> {selectedTime || 'N/A'}</p>
                </AlertDescription>
              </Alert>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                <Button onClick={handleConfirmBooking} className="flex-1" variant="default">Confirm Booking</Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-center">Book an Appointment</h1>
      
      {/* Progress Steps (visual only) */}
      <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-8">
        {[1,2,3].map(s => (
          <div key={s} className="flex items-center">
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 font-medium
              ${step >= s ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'}`}>
              {s}
            </div>
            {s < 3 && <div className={`h-0.5 w-8 sm:w-12 ${step > s ? 'bg-primary' : 'bg-border'}`}></div>}
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto">
        {renderStepContent()}
      </div>
    </div>
  );
}
