
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, type DocumentData } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger, SidebarFooter } from '@/components/ui/sidebar';
import { AppLogo } from '@/components/layout/app-logo';
import { UserNav } from '@/components/layout/user-nav';
import { LayoutDashboard, UserCog, Users, CalendarDays, Settings, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DoctorLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [doctorData, setDoctorData] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setCurrentUser(userAuth);
        try {
          const doctorDocRef = doc(db, "doctors", userAuth.uid);
          const doctorDocSnap = await getDoc(doctorDocRef);
          if (doctorDocSnap.exists()) {
            setDoctorData(doctorDocSnap.data());
          } else {
            // Handle case where doctor document might not exist or role is incorrect
            console.warn("Doctor document not found for UID:", userAuth.uid);
            // Potentially redirect if role mismatch is critical
            // router.push('/auth/doctor-login'); 
            // return;
          }
        } catch (error) {
          console.error("Error fetching doctor data:", error);
          // Handle error, maybe redirect or show error message
        }
        setIsLoading(false);
      } else {
        setCurrentUser(null);
        setDoctorData(null);
        setIsLoading(false);
        router.push('/auth/doctor-login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    // This case should be handled by the redirect in useEffect,
    // but as a fallback, we can return null or a redirecting message.
    return null; 
  }

  const doctorName = doctorData?.fullName || currentUser.email || "Doctor";
  const doctorEmail = currentUser.email || "doctor@example.com";

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4 items-start">
          <AppLogo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard" isActive={true}>
                <Link href="/doctor/dashboard"><LayoutDashboard /><span>Dashboard</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Appointments">
                <Link href="/doctor/dashboard#appointments"><CalendarDays /><span>Appointments</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Patients">
                 <Link href="/doctor/dashboard#patients"><Users /><span>Patients</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile">
                <Link href="/doctor/profile"><UserCog /><span>Profile</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto">
          <UserNav userType="doctor" userName={doctorName} userEmail={doctorEmail} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
         <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:justify-end">
            <SidebarTrigger className="md:hidden" /> {/* Only show on mobile */}
            <div className="hidden md:block">
              {/* Placeholder for any header content on desktop if UserNav is in sidebar footer */}
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
