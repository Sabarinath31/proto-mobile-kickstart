import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { FloatingActionButton } from "@/components/layout/FloatingActionButton";
import { TaskListItem } from "@/components/tasks/TaskListItem";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { FlowerGrowth } from "@/components/tasks/FlowerGrowth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { taskService, Task } from "@/services/taskService";
import { supabase } from "@/integrations/supabase/client";
import skyBackground from "@/assets/illustrations/sky-background.png";
import { format } from "date-fns";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
    subscribeToTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setCurrentUserId(user.id);
      const tasksData = await taskService.getTasks(user.id);
      setTasks(tasksData as Task[]);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToTasks = () => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      const channel = taskService.subscribeToTasks(user.id, () => {
        loadTasks();
      });

      return () => {
        supabase.removeChannel(channel);
      };
    });
  };

  const categories = ["all", "Personal", "Work", "Shopping", "Health", "Other"];

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = activeFilter === "all" || !task.is_completed;
    const matchesCategory = activeCategory === "all"; // TODO: Add category filtering
    return matchesFilter && matchesCategory;
  });

  const activeTasks = filteredTasks.filter((t) => !t.is_completed);
  const completedTasks = filteredTasks.filter((t) => t.is_completed);
  const completionPercentage = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  const handleToggleTask = async (id: string) => {
    try {
      await taskService.toggleComplete(id);
      const task = tasks.find((t) => t.id === id);
      if (task) {
        toast({
          title: task.is_completed ? "Task reopened" : "Task completed! 🎉",
          description: task.is_completed ? task.title : `Great job completing "${task.title}"`,
        });
      }
    } catch (error) {
      console.error("Error toggling task:", error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleSaveTask = async (taskData: any) => {
    try {
      if (taskData.id && tasks.find((t) => t.id === taskData.id)) {
        await taskService.updateTask(taskData.id, {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          due_date: taskData.dueDate,
        });
        toast({ title: "Task updated", description: "Your task has been updated successfully." });
      } else {
        await taskService.createTask({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          due_date: taskData.dueDate,
        });
        toast({ title: "Task created", description: "New task added to your list." });
      }
    } catch (error) {
      console.error("Error saving task:", error);
      toast({
        title: "Error",
        description: "Failed to save task",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${skyBackground})` }}
    >
      <Header title="Tasks" />
      <PageContainer className="pb-24">
        {/* Progress Section - Flower Growth Visualization */}
        <div className="mb-6 p-6 rounded-2xl bg-card/95 backdrop-blur-sm border shadow-lg">
          <h3 className="font-semibold text-center mb-2">Your Growth Today</h3>
          <FlowerGrowth completionPercentage={completionPercentage} />
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Active Tasks */}
        <div className="space-y-3 mb-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
          ) : activeTasks.length > 0 ? (
            activeTasks.map((task) => (
              <TaskListItem
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description || undefined}
                dueDate={task.due_date ? format(new Date(task.due_date), "MMM dd, yyyy") : undefined}
                priority={task.priority}
                category={task.category_id || "Other"}
                isCompleted={task.is_completed}
                fromMessage={!!task.created_from_message_id}
                onToggle={handleToggleTask}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-2">No active tasks</p>
              <p className="text-sm text-muted-foreground">
                Create a new task to get started
              </p>
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="mt-6">
            <Button
              variant="ghost"
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full justify-between mb-3"
            >
              <span className="font-semibold">
                Completed ({completedTasks.length})
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showCompleted ? "rotate-180" : ""
                }`}
              />
            </Button>

            {showCompleted && (
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskListItem
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description || undefined}
                    dueDate={task.due_date ? format(new Date(task.due_date), "MMM dd, yyyy") : undefined}
                    priority={task.priority}
                    category={task.category_id || "Other"}
                    isCompleted={task.is_completed}
                    fromMessage={!!task.created_from_message_id}
                    onToggle={handleToggleTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </PageContainer>

      <FloatingActionButton onClick={() => setDialogOpen(true)} icon={<Plus className="h-6 w-6" />} />

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveTask}
      />

      <BottomNavigation />
    </div>
  );
};

export default Tasks;
