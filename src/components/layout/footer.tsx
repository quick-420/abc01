export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between pl-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Hygienea. All rights reserved.
        </p>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
