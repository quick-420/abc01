import { AppLogo } from './app-logo';
import { MainNav } from './main-nav';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between pl-6">
        <AppLogo />
        <MainNav />
      </div>
    </header>
  );
}
