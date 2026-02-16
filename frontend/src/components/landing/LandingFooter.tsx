import BBLogo from "./BBLogo";

export default function LandingFooter() {
  return (
    <footer className="border-t border-border px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 md:flex-row md:justify-between">
        <BBLogo />

        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Contact
          </a>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Budget Buddy
        </p>
      </div>
    </footer>
  );
}
