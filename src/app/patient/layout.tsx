
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
import { LayoutDashboard, UserCog, CalendarPlus, ClipboardList, Settings, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PatientLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [patientData, setPatientData] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setCurrentUser(userAuth);
        try {
          const patientDocRef = doc(db, "patients", userAuth.uid);
          const patientDocSnap = await getDoc(patientDocRef);
          if (patientDocSnap.exists()) {
            setPatientData(patientDocSnap.data());
          } else {
             console.warn("Patient document not found for UID:", userAuth.uid);
            // Potentially redirect if role mismatch is critical
            // router.push('/auth/patient-login');
            // return;
          }
        } catch (error) {
          console.error("Error fetching patient data:", error);
        }
        setIsLoading(false);
      } else {
        setCurrentUser(null);
        setPatientData(null);
        setIsLoading(false);
        router.push('/auth/patient-login');
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
    return null;
  }

  const patientName = patientData?.fullName || currentUser.email || "Patient";
  const patientEmail = currentUser.email || "patient@example.com";

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
                <Link href="/patient/dashboard"><LayoutDashboard /><span>Dashboard</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Book Appointment">
                <Link href="/patient/book-appointment"><CalendarPlus /><span>Book Appointment</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Medical Records">
                <Link href="/patient/dashboard#records"><ClipboardList /><span>Medical Records</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile">
                <Link href="/patient/profile"><UserCog /><span>Profile</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto">
          <UserNav userType="patient" userName={patientName} userEmail={patientEmail}/>
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
