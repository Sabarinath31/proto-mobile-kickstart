import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { MoodSelector } from "@/components/profile/MoodSelector";
import { DailyGrowth } from "@/components/profile/DailyGrowth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Settings, Bell, LogOut, ChevronRight, Edit } from "lucide-react";
import { profileService, Profile as ProfileType } from "@/services/profileService";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const data = await profileService.getProfile(user.id);
      setProfile(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: error.message,
      });
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Profile" />
      
      <PageContainer>
        <div className="space-y-6 animate-fade-in">
          {/* Mood Garden Header */}
          <Card className="overflow-hidden">
            <CardContent className="pt-6">
              <MoodSelector />
            </CardContent>
          </Card>

          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ""} alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {user?.email ? getInitials(user.email) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    {profile?.display_name || user?.email}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  {profile?.bio && (
                    <p className="mt-2 text-sm text-muted-foreground">{profile.bio}</p>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">
                    Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/profile/edit")}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Daily Growth Section */}
          <Card>
            <CardContent className="pt-6">
              <DailyGrowth focusSessions={3} />
            </CardContent>
          </Card>

          {/* Settings Options */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => navigate("/settings")}
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5" />
                  <span>App Settings</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => navigate("/settings/notifications")}
              >
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Sign Out */}
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleSignOut}
            disabled={loading}
          >
            <LogOut className="mr-2 h-5 w-5" />
            {loading ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </PageContainer>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
