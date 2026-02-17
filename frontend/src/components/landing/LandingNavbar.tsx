import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/ui/button";
import { cn } from "@/lib/utils";
import BBLogo from "./BBLogo";

export default function LandingNavbar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px 0px 0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-transform duration-300 ease-out",
        hidden && "-translate-y-full"
      )}
    >
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
