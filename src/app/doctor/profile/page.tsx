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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

const doctorProfileSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  specialization: z.string().min(1, { message: "Please select a specialization." }),
  licenseNumber: z.string().min(3, { message: "License number is required." }),
  contactNumber: z.string().optional(),
  officeAddress: z.string().optional(),
  profileBio: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

type DoctorProfileValues = z.infer<typeof doctorProfileSchema>;

const specializations = [
  "Cardiology", "Dermatology", "Pediatrics", "Neurology", "Oncology", "General Medicine"
];

// Placeholder current doctor data
const currentDoctorData = {
  fullName: "Dr. Emily Carter",
  email: "emily.carter@medilink.com",
  specialization: "Cardiology",
  licenseNumber: "LIC12345",
  contactNumber: "555-0101",
  officeAddress: "123 Health St, Medville, CA 90210",
  profileBio: "Experienced cardiologist dedicated to providing comprehensive heart care. Fluent in English and Spanish.",
  avatarUrl: "https://placehold.co/150x150.png",
};

export default function DoctorProfilePage() {
  const { toast } = useToast();

  const form = useForm<DoctorProfileValues>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: currentDoctorData,
  });

  function onSubmit(data: DoctorProfileValues) {
    console.log(data);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  }

  const initials = form.watch("fullName")?.split(' ').map(n => n[0]).join('').toUpperCase() || 'DC';

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">Doctor Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Information</CardTitle>
          <CardDescription>Keep your professional details accurate and up-to-date.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center space-y-4 mb-6">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={form.watch("avatarUrl") || `https://placehold.co/150x150.png?text=${initials}`} alt={form.watch("fullName")} data-ai-hint="doctor portrait" />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" /> Upload Photo
                  </Button>
                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. John Doe" {...field} />
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
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your specialization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {specializations.map(spec => (
                            <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical License Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., A12345678" {...field} />
                      </FormControl>
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
                  name="officeAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office Address (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 123 Main St, Anytown" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="profileBio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Bio (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us a bit about your practice and experience." className="resize-none min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" variant="default">
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
