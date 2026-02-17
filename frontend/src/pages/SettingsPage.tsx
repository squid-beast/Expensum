import { useState } from "react";
import {
  Moon,
  Sun,
  Bell,
  BellOff,
  Globe,
  Shield,
  Trash2,
  LogOut,
  ChevronRight,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

interface SettingToggleProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function SettingToggle({ icon, label, description, enabled, onToggle }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
          enabled ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

interface SettingLinkProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  destructive?: boolean;
}

function SettingLink({ icon, label, description, onClick, destructive }: SettingLinkProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between py-3 w-full text-left cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
          destructive ? "bg-destructive/10" : "bg-muted"
        }`}>
          {icon}
        </div>
        <div>
          <p className={`text-sm font-medium ${destructive ? "text-destructive" : ""}`}>{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <ChevronRight className={`h-4 w-4 ${destructive ? "text-destructive" : "text-muted-foreground"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  // Local UI preferences (persisted to localStorage)
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [notifications, setNotifications] = useState(
    () => localStorage.getItem("notifications_enabled") !== "false"
  );
  const [currency, setCurrency] = useState(
    () => localStorage.getItem("currency") || "USD"
  );

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  const toggleNotifications = () => {
    const next = !notifications;
    setNotifications(next);
    localStorage.setItem("notifications_enabled", String(next));
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your app preferences</p>
        </div>

        {/* Appearance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <SettingToggle
              icon={darkMode ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
              label="Dark Mode"
              description="Switch between light and dark theme"
              enabled={darkMode}
              onToggle={toggleDarkMode}
            />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <SettingToggle
              icon={notifications ? <Bell className="h-4 w-4 text-muted-foreground" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
              label="Push Notifications"
              description="Get notified about budget alerts and household activity"
              enabled={notifications}
              onToggle={toggleNotifications}
            />
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <SettingLink
              icon={<Globe className="h-4 w-4 text-muted-foreground" />}
              label={`Currency: ${currency}`}
              description="Change your display currency"
              onClick={() => {
                const next = currency === "USD" ? "EUR" : currency === "EUR" ? "GBP" : "USD";
                setCurrency(next);
                localStorage.setItem("currency", next);
              }}
            />
            <SettingLink
              icon={<Shield className="h-4 w-4 text-muted-foreground" />}
              label="Privacy & Security"
              description="Manage your data and privacy settings"
              onClick={() => navigate("/profile")}
            />
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <SettingLink
              icon={<LogOut className="h-4 w-4 text-muted-foreground" />}
              label="Sign Out"
              description="Log out of your account"
              onClick={handleLogout}
            />
            <SettingLink
              icon={<Trash2 className="h-4 w-4 text-destructive" />}
              label="Delete Account"
              description="Permanently delete your account and data"
              onClick={() => {/* Future: show confirmation */}}
              destructive
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
