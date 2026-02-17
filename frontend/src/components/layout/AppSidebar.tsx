import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Home,
  UserCog,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebar,
  type SidebarLinkConfig,
} from "@/components/ui/sidebar";
import HouseholdSwitcher from "@/components/household/HouseholdSwitcher";
import { useHouseholdStore } from "@/store/householdStore";

const iconClass = "text-muted-foreground dark:text-neutral-200 h-5 w-5 flex-shrink-0";

const navLinks: SidebarLinkConfig[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className={iconClass} />,
  },
  {
    label: "Expenses",
    href: "/expenses",
    icon: <Receipt className={iconClass} />,
  },
  {
    label: "Income",
    href: "/income-setup",
    icon: <Wallet className={iconClass} />,
  },
  {
    label: "Household",
    href: "/household",
    icon: <Home className={iconClass} />,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: <UserCog className={iconClass} />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className={iconClass} />,
  },
  {
    label: "Logout",
    href: "/login",
    icon: <LogOut className={iconClass} />,
  },
];

// Unsplash stock avatar (reliable placeholder)
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";

function SidebarLogo() {
  const { open } = useSidebar();
  return (
    <Link
      to="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-foreground py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-primary dark:bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-semibold text-foreground whitespace-pre"
        style={{
          display: open ? "inline-block" : "none",
          overflow: "hidden",
        }}
      >
        Budget Buddy
      </motion.span>
    </Link>
  );
}

function SidebarLogoIcon() {
  return (
    <Link
      to="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-foreground py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-primary dark:bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
}

function SidebarContent() {
  const { open } = useSidebar();
  const { households } = useHouseholdStore();
  return (
    <>
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        {open ? <SidebarLogo /> : <SidebarLogoIcon />}
        <div className="mt-8 flex flex-col gap-2">
          {navLinks.map((link) =>
            link.label === "Logout" ? (
              <LogoutButton key={link.label} />
            ) : (
              <SidebarLink key={link.label} link={link} />
            )
          )}
        </div>
        {households.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <HouseholdSwitcher />
          </div>
        )}
      </div>
      <UserCard />
    </>
  );
}

function LogoutButton() {
  const { open } = useSidebar();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clearAuth();
    navigate("/login");
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center justify-start gap-2 group/sidebar py-2 text-muted-foreground dark:text-neutral-200 hover:text-destructive cursor-pointer w-full text-left"
    >
      <LogOut className={iconClass} />
      <motion.span
        animate={{
          display: open ? "inline-block" : "none",
          opacity: open ? 1 : 0,
        }}
        className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        Logout
      </motion.span>
    </button>
  );
}

function UserCard() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="flex-shrink-0 py-4 border-t border-border">
      <SidebarLink
        link={{
          label: user?.fullName ?? "User",
          href: "/profile",
          icon: (
            <img
              src={DEFAULT_AVATAR}
              alt=""
              className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
              width={28}
              height={28}
            />
          ),
        }}
      />
    </div>
  );
}

export default function AppSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="h-screen">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className={cn("justify-between gap-10")}>
          <SidebarContent />
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
