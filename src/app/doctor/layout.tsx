
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
import { LayoutDashboard, UserCog, Users, CalendarDays, Settings, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DoctorLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
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
          if (doctorDocSnap.exists() && doctorDocSnap.data()?.role === 'doctor') {
            setDoctorData(doctorDocSnap.data());
          } else {
            console.warn("User is not a doctor or doctor document missing:", userAuth.uid);
            router.push('/auth/doctor-login'); return;
          }
        } catch (error) {
          console.error("Error fetching doctor data:", error);
          router.push('/auth/doctor-login'); return;
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
              <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === "/doctor/dashboard"}>
                <Link href="/doctor/dashboard"><LayoutDashboard /><span>Dashboard</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Appointments" isActive={pathname.includes("#appointments")}>
                <Link href="/doctor/dashboard#appointments"><CalendarDays /><span>Appointments</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Patients" isActive={pathname.includes("#patients")}>
                 <Link href="/doctor/dashboard#patients"><Users /><span>Patients</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile" isActive={pathname === "/doctor/profile"}>
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
            <SidebarTrigger className="md:hidden" /> 
            <div className="hidden md:block">
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
