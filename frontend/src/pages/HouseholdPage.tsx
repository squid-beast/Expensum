import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, Copy, Check, Loader2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import CreateHouseholdForm from "@/components/household/CreateHouseholdForm";
import InviteMemberForm from "@/components/household/InviteMemberForm";
import MemberList from "@/components/household/MemberList";
import PendingInvitations from "@/components/household/PendingInvitations";
import { householdService } from "@/services/householdService";
import { useHouseholdStore } from "@/store/householdStore";
import type { HouseholdDetail, Invitation } from "@/types/household.types";

export default function HouseholdPage() {
  const { households, setHouseholds, activeHousehold, setActiveHousehold } =
    useHouseholdStore();
  const [detail, setDetail] = useState<HouseholdDetail | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hList, inv] = await Promise.all([
        householdService.getMyHouseholds(),
        householdService.getPendingInvitations(),
      ]);
      setHouseholds(hList);
      setInvitations(inv);

      // If active household exists, fetch its detail
      const target = activeHousehold ?? hList[0] ?? null;
      if (target) {
        const d = await householdService.getDetail(target.id);
        setDetail(d);
        if (!activeHousehold) setActiveHousehold(target);
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeHousehold) {
      householdService.getDetail(activeHousehold.id).then(setDetail).catch(() => {});
    } else {
      setDetail(null);
    }
  }, [activeHousehold]);

  const handleCopyCode = async () => {
    if (!detail) return;
    await navigator.clipboard.writeText(detail.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            Household
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your shared living space and track expenses together
          </p>
        </motion.div>

        {/* Pending invitations */}
        <PendingInvitations invitations={invitations} onUpdate={fetchData} />

        {/* No household yet */}
        {households.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create a household</CardTitle>
              <CardDescription>
                Set up a shared space to track expenses with your roommates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateHouseholdForm onCreated={fetchData} />
            </CardContent>
          </Card>
        )}

        {/* Household detail */}
        {detail && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Info + invite code */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{detail.name}</CardTitle>
                    <CardDescription>
                      {detail.memberCount} member{detail.memberCount !== 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied" : "Invite code"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <InviteMemberForm householdId={detail.id} />
              </CardContent>
            </Card>

            {/* Members */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Members</CardTitle>
              </CardHeader>
              <CardContent>
                <MemberList members={detail.members} />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Create additional household (if user already has one) */}
        {households.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">New household</CardTitle>
              <CardDescription>
                Create another shared space
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateHouseholdForm onCreated={fetchData} />
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
