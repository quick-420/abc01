
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, type DocumentData } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger, SidebarFooter } from '@/components/ui/sidebar';
import { AppLogo } from '@/components/layout/app-logo';
import { UserNav } from '@/components/layout/user-nav';
import { LayoutDashboard, UserCog, CalendarPlus, ClipboardList, MessageSquare, Settings, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PatientLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [patientData, setPatientData] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setCurrentUser(userAuth);
        try {
          const userDocRef = doc(db, "users", userAuth.uid); // Check general user role first
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists() && userDocSnap.data()?.role === 'patient') {
            const patientDocRef = doc(db, "patients", userAuth.uid);
            const patientDocSnap = await getDoc(patientDocRef);
            if (patientDocSnap.exists()) {
              setPatientData(patientDocSnap.data());
            } else {
               console.warn("Patient document not found for UID:", userAuth.uid);
               // router.push('/auth/patient-login'); return;
            }
          } else {
            // Role mismatch or user doc doesn't exist
            console.warn("User is not a patient or user document missing:", userAuth.uid);
            router.push('/auth/patient-login'); return;
          }
        } catch (error) {
          console.error("Error fetching patient data:", error);
          router.push('/auth/patient-login'); return;
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
    return null; // Should be handled by redirect
  }

  const patientName = patientData?.fullName || currentUser.email || "Patient";
  const patientEmail = currentUser.email || "patient@example.com";
  
  const isChatPage = pathname.startsWith('/chat');

  return (
    <SidebarProvider defaultOpen={!isChatPage}>
      <Sidebar side="left" variant="sidebar" collapsible="icon" className={isChatPage ? "md:hidden" : ""}>
        <SidebarHeader className="p-4 items-start">
          <AppLogo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === "/patient/dashboard"}>
                <Link href="/patient/dashboard"><LayoutDashboard /><span>Dashboard</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Book Appointment" isActive={pathname === "/patient/book-appointment"}>
                <Link href="/patient/book-appointment"><CalendarPlus /><span>Book Appointment</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Messages" isActive={pathname.startsWith("/chat")}>
                <Link href="/chat"><MessageSquare /><span>Messages</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Medical Records" isActive={pathname.includes("#records")}>
                <Link href="/patient/dashboard#records"><ClipboardList /><span>Medical Records</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile" isActive={pathname === "/patient/profile"}>
                <Link href="/patient/profile"><UserCog /><span>Profile</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto">
          <UserNav userType="patient" userName={patientName} userEmail={patientEmail}/>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className={`flex flex-col ${isChatPage ? "ml-0 peer-data-[variant=inset]:md:ml-0" : ""}`}>
        {!isChatPage && (
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:justify-end">
              <SidebarTrigger className="md:hidden" /> 
              <div className="hidden md:block">
                {/* Placeholder for any header content on desktop if UserNav is in sidebar footer */}
              </div>
          </header>
        )}
        <main className={`flex-1 overflow-y-auto ${isChatPage ? "" : "p-6"}`}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
