import { Shield, Lock, Eye, Database, Fingerprint, FileText } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { useAuthStore } from "@/store/authStore";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

export default function PrivacySecurityPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
        <div>
          <h1 className="text-xl font-bold">Privacy & Security</h1>
          <p className="text-sm text-muted-foreground">
            How we protect your data and keep your account secure
          </p>
        </div>

        {/* Account Security */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Account Security</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <InfoRow
              icon={<Lock className="h-4 w-4 text-muted-foreground" />}
              label="Password"
              value="Your password is securely hashed and never stored in plain text. We use industry-standard encryption to protect your credentials."
            />
            <InfoRow
              icon={<Fingerprint className="h-4 w-4 text-muted-foreground" />}
              label="Session Management"
              value="Sessions expire after 24 hours of inactivity. You can sign out from all devices by logging out and back in."
            />
            <div className="flex items-start gap-3 py-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">Signed in as</p>
                <p className="text-xs text-muted-foreground">{user?.email ?? "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Privacy */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Data Privacy</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <InfoRow
              icon={<Database className="h-4 w-4 text-muted-foreground" />}
              label="Data Storage"
              value="Your expense data, household information, and account details are stored securely on encrypted servers. We do not sell or share your personal data with third parties."
            />
            <InfoRow
              icon={<Eye className="h-4 w-4 text-muted-foreground" />}
              label="Data Visibility"
              value="Personal expenses are visible only to you. Shared household expenses are visible to all members of that household. You control what you share."
            />
            <InfoRow
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
              label="Data Retention"
              value="Your data is retained as long as your account is active. You can request deletion of your account and all associated data by contacting support."
            />
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
