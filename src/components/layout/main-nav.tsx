
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle"; // Added

export function MainNav() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true); // Start loading
      if (user) {
        setCurrentUser(user);
        // Determine role from appropriate collection
        const patientDocRef = doc(db, "patients", user.uid);
        const patientDocSnap = await getDoc(patientDocRef);
        if (patientDocSnap.exists() && patientDocSnap.data()?.role === 'patient') {
          setUserRole('patient');
        } else {
          const doctorDocRef = doc(db, "doctors", user.uid);
          const doctorDocSnap = await getDoc(doctorDocRef);
          if (doctorDocSnap.exists() && doctorDocSnap.data()?.role === 'doctor') {
            setUserRole('doctor');
          } else {
            setUserRole(null); // Role unknown or not one of these
          }
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setIsLoading(false); // End loading
    });

    return () => unsubscribe();
  }, []);

  const handlePatientPortalClick = () => {
    if (isLoading) return;
    if (currentUser && userRole === 'patient') {
      router.push('/patient/dashboard');
    } else {
      router.push('/auth/patient-login');
    }
  };

  const handleDoctorPortalClick = () => {
    if (isLoading) return;
    if (currentUser && userRole === 'doctor') {
      router.push('/doctor/dashboard');
    } else {
      router.push('/auth/doctor-login');
    }
  };

  return (
    <nav className="flex items-center space-x-1 sm:space-x-2">
      <Button variant="ghost" asChild>
        <Link href="/#features">Features</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/faq">FAQ</Link>
      </Button>
      <Button variant="ghost" onClick={handlePatientPortalClick} disabled={isLoading}>
        Patient Portal
      </Button>
      <Button variant="ghost" onClick={handleDoctorPortalClick} disabled={isLoading}>
        Doctor Portal
      </Button>
      <ThemeToggle />
      <LanguageToggle /> {/* Added */}
    </nav>
  );
}
