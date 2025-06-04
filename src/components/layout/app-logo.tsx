import { HeartPulse } from 'lucide-react';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <HeartPulse className="h-8 w-8" />
      <span className="font-headline text-2xl font-semibold">Hygienea</span>
    </Link>
  );
}
