import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function MainNav() {
  return (
    <nav className="flex items-center space-x-2 sm:space-x-4">
      <Button variant="ghost" asChild>
        <Link href="/#features">Features</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/faq">FAQ</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/auth/patient-login">Patient Portal</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/auth/doctor-login">Doctor Portal</Link>
      </Button>
    </nav>
  );
}
