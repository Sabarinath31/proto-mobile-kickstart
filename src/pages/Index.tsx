import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { FloatingActionButton } from "@/components/layout/FloatingActionButton";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { MessageCircle, CheckCircle2, Timer, Plus, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mock data for dashboard
  const stats = {
    unreadMessages: 7,
    pendingTasks: 3,
    focusTime: 45, // minutes
  };

  const recentConversations = [
    { id: "1", name: "Sarah Johnson", message: "Let's discuss the meeting", time: "10:33 AM" },
    { id: "2", name: "Project Team", message: "Alex: Let's schedule a call", time: "Yesterday" },
  ];

  const todayTasks = [
    { id: "1", title: "Review project proposal", priority: "high", isCompleted: false },
    { id: "2", title: "Buy groceries", priority: "medium", isCompleted: false },
    { id: "3", title: "Call dentist", priority: "high", isCompleted: false },
  ];

  const completedTasks = todayTasks.filter(t => t.isCompleted).length;
  const totalTasks = todayTasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleSaveTask = (task: any) => {
    toast({ title: "Task created", description: "New task added to your list." });
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageContainer className="pb-24">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">Here's your overview for today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link to="/messages">
            <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex flex-col items-center text-center">
                <MessageCircle className="h-5 w-5 text-primary mb-2" />
                <p className="text-2xl font-bold">{stats.unreadMessages}</p>
                <p className="text-xs text-muted-foreground">Unread</p>
              </div>
            </Card>
          </Link>
          
          <Link to="/tasks">
            <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="h-5 w-5 text-accent mb-2" />
                <p className="text-2xl font-bold">{stats.pendingTasks}</p>
                <p className="text-xs text-muted-foreground">Tasks</p>
              </div>
            </Card>
          </Link>
          
          <Link to="/focus">
            <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex flex-col items-center text-center">
                <Timer className="h-5 w-5 text-warning mb-2" />
                <p className="text-2xl font-bold">{stats.focusTime}m</p>
                <p className="text-xs text-muted-foreground">Focus</p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Today's Progress */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Today's Progress</h3>
            <span className="text-sm text-muted-foreground">
              {completedTasks}/{totalTasks} completed
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            {completionPercentage === 100 
              ? "Amazing work! All tasks completed! 🎉"
              : "Keep going! You're making progress."}
          </p>
        </Card>

        {/* Recent Conversations */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent Conversations</h3>
            <Link to="/messages">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-2">
            {recentConversations.map((conv) => (
              <Link key={conv.id} to={`/chat/${conv.id}`}>
                <Card className="p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{conv.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{conv.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">{conv.time}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Today's Priority Tasks</h3>
            <Link to="/tasks">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <Card key={task.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                  </div>
                  <Badge
                    variant={task.priority === "high" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/focus">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <Timer className="h-5 w-5" />
              <span className="text-sm">Start Focus</span>
            </Button>
          </Link>
          
          <Link to="/messages">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">New Message</span>
            </Button>
          </Link>
        </div>
      </PageContainer>

      <FloatingActionButton 
        onClick={() => setDialogOpen(true)} 
        icon={<Plus className="h-6 w-6" />}
      />

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveTask}
      />

      <BottomNavigation />
    </div>
  );
};

export default Index;
