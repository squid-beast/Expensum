import { useState } from "react";
import {
  Moon,
  Sun,
  Globe,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Select } from "@/ui/select";
import { Label } from "@/ui/label";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
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
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
          enabled ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
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
}

function SettingLink({ icon, label, description, onClick }: SettingLinkProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between py-3 w-full text-left cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

const currencies = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "INR", label: "INR — Indian Rupee" },
  { value: "CAD", label: "CAD — Canadian Dollar" },
  { value: "AUD", label: "AUD — Australian Dollar" },
  { value: "JPY", label: "JPY — Japanese Yen" },
];

export default function SettingsPage() {
  const { clearAuth } = useAuthStore();
  const { currency, setCurrency } = useSettingsStore();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
        <div>
          <h1 className="text-xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your app preferences</p>
        </div>

        {/* Appearance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingToggle
              icon={darkMode ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
              label="Dark Mode"
              description="Switch between light and dark theme"
              enabled={darkMode}
              onToggle={toggleDarkMode}
            />
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {/* Currency selector */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <Label htmlFor="currency-select" className="text-sm font-medium cursor-pointer">Currency</Label>
                  <p className="text-xs text-muted-foreground">Display currency for amounts</p>
                </div>
              </div>
              <Select
                id="currency-select"
                value={currency}
                onChange={handleCurrencyChange}
                className="w-auto h-9 text-sm"
              >
                {currencies.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>

            <SettingLink
              icon={<Shield className="h-4 w-4 text-muted-foreground" />}
              label="Privacy & Security"
              description="Manage your data and privacy settings"
              onClick={() => navigate("/privacy-security")}
            />
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingLink
              icon={<LogOut className="h-4 w-4 text-muted-foreground" />}
              label="Sign Out"
              description="Log out of your account"
              onClick={handleLogout}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
