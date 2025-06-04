
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, CalendarIcon, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

const patientProfileSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }).readonly(), // Email should not be editable here
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  medicalHistory: z.string().optional(),
  avatarUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type PatientProfileValues = z.infer<typeof patientProfileSchema>;

export default function PatientProfilePage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PatientProfileValues>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      dateOfBirth: new Date(),
      contactNumber: "",
      address: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      medicalHistory: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const patientDocRef = doc(db, "patients", user.uid);
          const patientDocSnap = await getDoc(patientDocRef);
          if (patientDocSnap.exists()) {
            const data = patientDocSnap.data();
            // Convert Firestore Timestamp to Date object for dateOfBirth
            const formData = {
              ...data,
              email: user.email || data.email, // Ensure email is from auth or db
              dateOfBirth: data.dateOfBirth instanceof Timestamp ? data.dateOfBirth.toDate() : new Date(),
            } as PatientProfileValues;
            form.reset(formData);
          } else {
            toast({
              title: "Profile Not Found",
              description: "Could not find your profile data. Please contact support.",
              variant: "destructive",
            });
            // Initialize with email from auth if profile doesn't exist
            form.reset({ email: user.email || "", fullName: user.displayName || "" });
          }
        } catch (error) {
          console.error("Error fetching patient profile:", error);
          toast({
            title: "Error",
            description: "Failed to load your profile data.",
            variant: "destructive",
          });
        }
      } else {
        // This case should ideally be handled by the layout redirecting to login
        setCurrentUser(null);
        toast({
            title: "Not Authenticated",
            description: "Please log in to view your profile.",
            variant: "destructive",
        });
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [form, toast]);

  async function onSubmit(data: PatientProfileValues) {
    if (!currentUser) {
      toast({
        title: "Not Authenticated",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const patientDocRef = doc(db, "patients", currentUser.uid);
      const dataToSave = {
        ...data,
        // email: currentUser.email, // Email is from auth, don't re-save from form if it's readonly
        dateOfBirth: Timestamp.fromDate(data.dateOfBirth), // Convert Date to Firestore Timestamp
        // Ensure role is preserved or set if it's part of your data model
        role: "patient", 
        uid: currentUser.uid, // Ensure uid is part of the document
      };
      
      await setDoc(patientDocRef, dataToSave, { merge: true }); // Use merge:true to avoid overwriting fields not in the form

      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating patient profile:", error);
      toast({
        title: "Update Failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const watchedFullName = form.watch("fullName");
  const initials = watchedFullName?.split(' ').map(n => n[0]).join('').toUpperCase() || (currentUser?.email?.charAt(0)?.toUpperCase() || 'P');
  const watchedAvatarUrl = form.watch("avatarUrl");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">Patient Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Information</CardTitle>
          <CardDescription>Keep your personal and medical details accurate.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center space-y-4 mb-6">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={watchedAvatarUrl || `https://placehold.co/150x150.png?text=${initials}`} alt={watchedFullName} data-ai-hint="patient portrait" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem className="w-full max-w-sm">
                        <FormLabel>Avatar URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/avatar.png" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <Button type="button" variant="outline" size="sm" disabled>
                  <Upload className="mr-2 h-4 w-4" /> Upload Photo (Coming Soon)
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} readOnly className="bg-muted/50 cursor-not-allowed"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 123 Main St, Anytown" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., (555) 987-6543" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History Summary (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Allergies, chronic conditions, medications..." className="resize-none min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" variant="default" disabled={isSubmitting || isLoading}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


    