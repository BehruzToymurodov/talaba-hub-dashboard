import { useQuery } from "@tanstack/react-query";

import { getMeRequest } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ["account", "me"],
    queryFn: getMeRequest,
    enabled: !!user
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account preferences" />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div>
                <p className="text-sm text-muted-foreground">Account</p>
                <p className="font-medium">{profile?.email ?? user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">
                  {profile ? `${profile.firstName} ${profile.lastName}` : user?.fullName ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{profile?.role ?? user?.role ?? "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Student Verification</p>
                <p className="font-medium">
                  {profile?.studentStatusVerified ?? user?.isStudentStatusVerified ? "Verified" : "Not verified"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preferences">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="text-sm font-medium">Theme</p>
                  <p className="text-xs text-muted-foreground">Toggle light and dark modes</p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
