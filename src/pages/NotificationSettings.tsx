import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NotificationSettings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Notifications" />
      
      <PageContainer>
        <div className="space-y-6 animate-fade-in">
          {/* Push Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>Control when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-enabled">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications on this device
                  </p>
                </div>
                <Switch id="push-enabled" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Message Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Notification preferences for messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="message-notifications">Message Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new messages
                  </p>
                </div>
                <Switch id="message-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="message-sound">Notification Sound</Label>
                <Select defaultValue="gentle">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gentle">Gentle</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="off">Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Task Reminders */}
          <Card>
            <CardHeader>
              <CardTitle>Task Reminders</CardTitle>
              <CardDescription>Manage task notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="task-reminders">Task Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about upcoming tasks
                  </p>
                </div>
                <Switch id="task-reminders" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="task-vibration">Vibration</Label>
                  <p className="text-sm text-muted-foreground">
                    Vibrate on task reminders
                  </p>
                </div>
                <Switch id="task-vibration" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Quiet Hours</CardTitle>
              <CardDescription>Set times when notifications are muted</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                  <p className="text-sm text-muted-foreground">
                    Mute notifications during specific times
                  </p>
                </div>
                <Switch id="quiet-hours" />
              </div>
            </CardContent>
          </Card>

          {/* Focus Session */}
          <Card>
            <CardHeader>
              <CardTitle>Focus Session Alerts</CardTitle>
              <CardDescription>Notifications during focus time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="focus-start">Focus Start</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert when focus session begins
                  </p>
                </div>
                <Switch id="focus-start" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="focus-end">Focus End</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert when focus session ends
                  </p>
                </div>
                <Switch id="focus-end" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>

      <BottomNavigation />
    </div>
  );
};

export default NotificationSettings;
