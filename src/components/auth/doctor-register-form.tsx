
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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const doctorRegisterFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
  specialization: z.string().min(1, { message: "Please select a specialization." }),
  licenseNumber: z.string().min(3, { message: "License number is required." }),
  profileBio: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type DoctorRegisterFormValues = z.infer<typeof doctorRegisterFormSchema>;

const specializations = [
  "Cardiology", "Dermatology", "Pediatrics", "Neurology", "Oncology", "General Medicine", "Dentist", "Physiotherapist", "Homeopathic Doctor", "Ayurvedic Doctor"
];

export function DoctorRegisterForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<DoctorRegisterFormValues>({
    resolver: zodResolver(doctorRegisterFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      specialization: "",
      licenseNumber: "",
      profileBio: "",
    },
  });

  async function onSubmit(data: DoctorRegisterFormValues) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Store doctor-specific details
      await setDoc(doc(db, "doctors", user.uid), {
        uid: user.uid,
        email: data.email,
        fullName: data.fullName,
        specialization: data.specialization,
        licenseNumber: data.licenseNumber,
        profileBio: data.profileBio || "",
        role: "doctor",
      });
      
      // This was primarily for chat, can be removed or kept if other features need a general 'users' collection.
      // For full rollback of chat, we remove this.
      // await setDoc(doc(db, "users", user.uid), {
      //   uid: user.uid,
      //   email: data.email,
      //   displayName: data.fullName, 
      //   role: "doctor", 
      // });

      toast({
        title: "Registration Successful",
        description: "Your doctor profile has been created. Redirecting to login...",
      });
      router.push(`/auth/doctor-login`);
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please use a different email or log in.";
      }
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
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
          name="profileBio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Bio (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us a bit about your practice and experience." className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" variant="default" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Registering..." : "Register as Doctor"}
        </Button>
      </form>
    </Form>
  );
}
