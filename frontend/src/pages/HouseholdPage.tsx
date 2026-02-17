import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Copy, Check, Loader2, Plus, Settings } from "lucide-react";
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

type HouseholdTab = "overview" | "manage";

export default function HouseholdPage() {
  const { households, setHouseholds, activeHousehold, setActiveHousehold } =
    useHouseholdStore();
  const [detail, setDetail] = useState<HouseholdDetail | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<HouseholdTab>("overview");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hList, inv] = await Promise.all([
        householdService.getMyHouseholds(),
        householdService.getPendingInvitations(),
      ]);
      setHouseholds(hList);
      setInvitations(inv);

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

  const handleCreated = () => {
    setShowCreateForm(false);
    fetchData();
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

        {/* Pending invitations — always visible */}
        <PendingInvitations invitations={invitations} onUpdate={fetchData} />

        {/* No household — show create form */}
        {households.length === 0 && !detail && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create a household</CardTitle>
              <CardDescription>
                Set up a shared space to track expenses with your roommates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateHouseholdForm onCreated={handleCreated} />
            </CardContent>
          </Card>
        )}

        {/* Has household — show tabbed view */}
        {detail && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Tab switcher */}
            <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
              <button
                onClick={() => setTab("overview")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                  tab === "overview"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setTab("manage")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  tab === "manage"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Settings className="h-3.5 w-3.5" />
                Manage
              </button>
            </div>

            <AnimatePresence mode="wait">
              {tab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  {/* Household info card */}
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

              {tab === "manage" && (
                <motion.div
                  key="manage"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  {/* Current household info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Current Household</CardTitle>
                      <CardDescription>
                        You are currently viewing <strong>{detail.name}</strong>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{detail.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {detail.memberCount} members · Invite code: {detail.inviteCode}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Switch household */}
                  {households.length > 1 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Switch Household</CardTitle>
                        <CardDescription>
                          You belong to {households.length} households
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {households.map((h) => (
                            <button
                              key={h.id}
                              onClick={() => setActiveHousehold(h)}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors cursor-pointer ${
                                activeHousehold?.id === h.id
                                  ? "bg-primary/10 border border-primary/20"
                                  : "bg-muted/50 hover:bg-muted border border-transparent"
                              }`}
                            >
                              <Home className="h-4 w-4 text-muted-foreground shrink-0" />
                              <div>
                                <p className="text-sm font-medium">{h.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {h.memberCount} members
                                </p>
                              </div>
                              {activeHousehold?.id === h.id && (
                                <span className="ml-auto text-xs text-primary font-medium">Active</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Create another household */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Create Another Household</CardTitle>
                          <CardDescription>
                            Set up a new shared space
                          </CardDescription>
                        </div>
                        {!showCreateForm && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCreateForm(true)}
                          >
                            <Plus className="h-4 w-4" />
                            New
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <AnimatePresence>
                      {showCreateForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <CardContent>
                            <CreateHouseholdForm onCreated={handleCreated} />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2"
                              onClick={() => setShowCreateForm(false)}
                            >
                              Cancel
                            </Button>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
