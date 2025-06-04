
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { mockDoctors } from "@/lib/placeholder-data";
import type { Doctor } from "@/lib/placeholder-data";
import { DoctorSelectionCard } from "@/components/patient/doctor-selection-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Info, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const availableTimeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM", "02:30 PM", "03:00 PM"
];

export default function BookAppointmentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isLoadingInitialDoctor, setIsLoadingInitialDoctor] = useState(true);


  useEffect(() => {
    const doctorId = searchParams.get('doctorId');
    if (doctorId) {
      const doctor = mockDoctors.find(d => d.id === doctorId);
      if (doctor) {
        setSelectedDoctor(doctor);
        setStep(2); 
        setSelectedDate(new Date());
        setSelectedTime(null);
      } else {
        toast({
          title: "Doctor Not Found",
          description: "The selected doctor ID is invalid. Please select a doctor from the list.",
          variant: "destructive",
        });
        // Optionally, remove the invalid doctorId from URL
        router.replace('/patient/book-appointment', undefined);
      }
    }
    setIsLoadingInitialDoctor(false);
  }, [searchParams, toast, router]);

  const handleSelectDoctor = (doctorId: string) => {
    const doctor = mockDoctors.find(d => d.id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
      setStep(2);
      setSelectedDate(new Date()); 
      setSelectedTime(null); 
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
    
    // Reset state and navigate to dashboard or clear query params
    router.replace('/patient/dashboard', undefined); 
    // Or if staying on page:
    // setStep(1);
    // setSelectedDoctor(null);
    // setSelectedDate(new Date());
    // setSelectedTime(null);
    // router.replace('/patient/book-appointment', undefined); 
  };
  
  if (isLoadingInitialDoctor) {
     return (
      <div className="flex flex-col min-h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading booking information...</p>
      </div>
    );
  }

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
              <CardDescription>Choose an available slot for your appointment with {selectedDoctor?.specialization}.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} 
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
                 <Button variant="link" onClick={() => {setStep(1); setSelectedDoctor(null); router.replace('/patient/book-appointment', undefined);}} className="mt-4 text-sm">
                    Change Doctor
                 </Button>
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
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back to Date/Time</Button>
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
      
      <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-8">
        {[
          {num: 1, label: "Select Doctor"}, 
          {num: 2, label: "Date & Time"},
          {num: 3, label: "Confirm"}
        ].map(s => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 font-medium
                ${step >= s.num ? 'bg-primary text-primary-foreground border-primary' : 
                (step === s.num -1 && selectedDoctor && s.num ===2) ? 'bg-primary text-primary-foreground border-primary' : // Highlight step 2 if doctor is selected
                'bg-secondary text-secondary-foreground border-border'}`}>
                {s.num}
                </div>
                <p className={`mt-1 text-xs sm:text-sm ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}>{s.label}</p>
            </div>
            {s.num < 3 && <div className={`h-0.5 w-8 sm:w-12 mt-[-1rem] ${step > s.num ? 'bg-primary' : 'bg-border'}`}></div>}
          </React.Fragment>
        ))}
      </div>
      <div className="max-w-4xl mx-auto">
        {renderStepContent()}
      </div>
    </div>
  );
}

    