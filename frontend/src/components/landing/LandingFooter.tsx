import { NavLink } from "react-router-dom";
import BBLogo from "./BBLogo";

export default function LandingFooter() {
  return (
    <footer className="border-t border-border px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 md:flex-row md:justify-between">
        <BBLogo />

        <div className="flex gap-6 text-sm text-muted-foreground">
          <NavLink
            to="/privacy"
            className={({ isActive }) =>
              `transition-colors hover:text-foreground ${isActive ? "text-foreground font-medium" : ""}`
            }
          >
            Privacy
          </NavLink>
          <NavLink
            to="/terms"
            className={({ isActive }) =>
              `transition-colors hover:text-foreground ${isActive ? "text-foreground font-medium" : ""}`
            }
          >
            Terms
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `transition-colors hover:text-foreground ${isActive ? "text-foreground font-medium" : ""}`
            }
          >
            Contact
          </NavLink>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Budget Buddy
        </p>
      </div>
    </footer>
  );
}
