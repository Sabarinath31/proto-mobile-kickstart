import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { FloatingActionButton } from "@/components/layout/FloatingActionButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, CheckSquare, Timer, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleQuickAction = () => {
    toast({
      title: "Quick Add",
      description: "Create a new task or message",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <PageContainer>
        <div className="space-y-6 animate-fade-in">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Welcome back!</h2>
            <p className="text-muted-foreground">Here's your overview for today</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="animate-scale-in">
              <CardContent className="p-4 text-center">
                <MessageCircle className="mx-auto h-6 w-6 text-primary mb-2" />
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Unread</p>
              </CardContent>
            </Card>
            
            <Card className="animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-4 text-center">
                <CheckSquare className="mx-auto h-6 w-6 text-accent mb-2" />
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">Tasks</p>
              </CardContent>
            </Card>
            
            <Card className="animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-4 text-center">
                <Timer className="mx-auto h-6 w-6 text-warning mb-2" />
                <p className="text-2xl font-bold">2h</p>
                <p className="text-xs text-muted-foreground">Focus</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Messages</CardTitle>
              <CardDescription>Your latest conversations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">JD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground truncate">Let's meet tomorrow...</p>
                </div>
                <span className="text-xs text-muted-foreground">2m</span>
              </div>
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Tasks</CardTitle>
              <CardDescription>Stay focused on what matters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <div className="h-5 w-5 rounded border-2 border-primary" />
                <p className="text-sm flex-1">Review project proposal</p>
                <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded">High</span>
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Assistant
              </CardTitle>
              <CardDescription>Get help staying organized</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Chat with AI
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>

      <FloatingActionButton onClick={handleQuickAction} />
      <BottomNavigation />
    </div>
  );
};

export default Index;
