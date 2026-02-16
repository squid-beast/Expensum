import { Link } from "react-router-dom";
import { buttonVariants } from "@/ui/button";
import { cn } from "@/lib/utils";
import BBLogo from "./BBLogo";

export default function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <BBLogo />
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
