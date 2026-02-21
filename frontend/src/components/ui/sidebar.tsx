import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, type LinkProps } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggleSidebar = useCallback(() => setOpen((v) => !v), []);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar (desktop + mobile shell)                                   */
/* ------------------------------------------------------------------ */

export function Sidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useSidebar();

  return (
    <>
      {/* Desktop — always visible */}
      <aside
        className={cn(
          "hidden md:flex md:flex-col md:w-64 md:shrink-0 border-r border-border bg-background h-screen sticky top-0",
          className
        )}
      >
        {children}
      </aside>

      {/* Mobile — sheet overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 md:hidden"
              onClick={() => setOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className={cn(
                "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background border-r border-border md:hidden",
                className
              )}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer z-10"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
              {children}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar structural slots                                           */
/* ------------------------------------------------------------------ */

export function SidebarHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2 p-4", className)}>
      {children}
    </div>
  );
}

export function SidebarContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex-1 overflow-y-auto overflow-x-hidden px-3 py-2", className)}>
      {children}
    </div>
  );
}

export function SidebarFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-t border-border p-3", className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Navigation groups                                                  */
/* ------------------------------------------------------------------ */

export function SidebarGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function SidebarGroupLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
        className
      )}
    >
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Menu primitives                                                    */
/* ------------------------------------------------------------------ */

export function SidebarMenu({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <nav className={cn("flex flex-col gap-0.5", className)}>{children}</nav>;
}

export function SidebarMenuItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("", className)}>{children}</div>;
}

export function SidebarMenuButton({
  children,
  href,
  isActive,
  onClick,
  className,
  ...props
}: {
  children: React.ReactNode;
  href?: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
} & Omit<LinkProps, "to" | "onClick" | "className">) {
  const { setOpen } = useSidebar();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (onClick) onClick(e);
  };

  const classes = cn(
    "flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
    isActive
      ? "bg-accent text-foreground"
      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
    className
  );

  if (href) {
    return (
      <Link to={href} className={classes} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(classes, "text-left")}
      onClick={(e) => {
        setOpen(false);
        if (onClick) onClick(e as unknown as React.MouseEvent);
      }}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Trigger (mobile hamburger)                                         */
/* ------------------------------------------------------------------ */

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      onClick={toggleSidebar}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer",
        className
      )}
      aria-label="Toggle sidebar"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Separator                                                          */
/* ------------------------------------------------------------------ */

export function SidebarSeparator({ className }: { className?: string }) {
  return <div className={cn("h-px bg-border mx-3 my-2", className)} />;
}
