
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export function MainNav() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Fetch user role from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserRole(userDocSnap.data()?.role);
        } else {
          // Handle case where user doc might not exist or role is missing
          setUserRole(null); 
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePatientPortalClick = () => {
    if (isLoading) return; // Prevent navigation while auth state is loading
    if (currentUser && userRole === 'patient') {
      router.push('/patient/dashboard');
    } else {
      router.push('/auth/patient-login');
    }
  };

  const handleDoctorPortalClick = () => {
    if (isLoading) return; // Prevent navigation while auth state is loading
    if (currentUser && userRole === 'doctor') {
      router.push('/doctor/dashboard');
    } else {
      router.push('/auth/doctor-login');
    }
  };

  return (
    <nav className="flex items-center space-x-2 sm:space-x-4">
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
    </nav>
  );
}
