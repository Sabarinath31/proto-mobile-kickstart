import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserPlus, UserMinus, LogOut, Bell, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockGroupInfo = {
  id: "2",
  name: "Project Team",
  avatar: "",
  description: "Team collaboration for the new project",
  members: [
    { id: "1", name: "Sarah Johnson", role: "Admin", avatar: "" },
    { id: "2", name: "Mike Chen", role: "Member", avatar: "" },
    { id: "3", name: "Emily Davis", role: "Member", avatar: "" },
    { id: "4", name: "Alex Rivera", role: "Moderator", avatar: "" },
  ],
};

const GroupInfo = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [group] = useState(mockGroupInfo);

  const handleAddMember = () => {
    toast({
      title: "Add member",
      description: "Member addition feature coming soon",
    });
  };

  const handleRemoveMember = (memberId: string) => {
    toast({
      title: "Remove member",
      description: "Member removed from group",
    });
  };

  const handleLeaveGroup = () => {
    toast({
      title: "Left group",
      description: "You have left the group",
    });
    navigate("/messages");
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "default";
      case "moderator":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Group Info" showBack />
      <PageContainer>
        {/* Group Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={group.avatar} alt={group.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {group.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-semibold mb-2">{group.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
          <Button variant="outline" size="sm">
            <Image className="h-4 w-4 mr-2" />
            Change Group Photo
          </Button>
        </div>

        <Separator className="my-6" />

        {/* Group Settings */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="mute-notifications">Mute Notifications</Label>
            </div>
            <Switch
              id="mute-notifications"
              checked={isMuted}
              onCheckedChange={setIsMuted}
            />
          </div>
        </div>

        <Separator className="my-6" />

        {/* Members Section */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Members ({group.members.length})
            </h3>
            <Button onClick={handleAddMember} size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>

          <div className="space-y-3">
            {group.members.map((member) => {
              const initials = member.name.split(" ").map(n => n[0]).join("").toUpperCase();
              
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-muted text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <Badge variant={getRoleBadgeVariant(member.role)} className="text-xs">
                        {member.role}
                      </Badge>
                    </div>
                  </div>

                  {member.role !== "Admin" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <UserMinus className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Leave Group */}
        <Button
          variant="destructive"
          onClick={handleLeaveGroup}
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Leave Group
        </Button>
      </PageContainer>
    </div>
  );
};

export default GroupInfo;
