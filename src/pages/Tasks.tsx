import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { FloatingActionButton } from "@/components/layout/FloatingActionButton";
import { TaskListItem } from "@/components/tasks/TaskListItem";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const initialTasks = [
  {
    id: "1",
    title: "Review project proposal",
    description: "Check the latest updates and provide feedback",
    dueDate: "Dec 20, 2024",
    priority: "high" as const,
    category: "Work",
    isCompleted: false,
    fromMessage: true,
  },
  {
    id: "2",
    title: "Buy groceries",
    description: "Milk, eggs, bread, vegetables",
    dueDate: "Dec 18, 2024",
    priority: "medium" as const,
    category: "Shopping",
    isCompleted: false,
    fromMessage: false,
  },
  {
    id: "3",
    title: "Call dentist",
    dueDate: "Dec 19, 2024",
    priority: "high" as const,
    category: "Health",
    isCompleted: false,
    fromMessage: false,
  },
  {
    id: "4",
    title: "Finish report",
    description: "Complete quarterly sales report",
    dueDate: "Dec 17, 2024",
    priority: "low" as const,
    category: "Work",
    isCompleted: true,
    fromMessage: false,
  },
];

const Tasks = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [showCompleted, setShowCompleted] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const categories = ["all", "Personal", "Work", "Shopping", "Health", "Other"];

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = activeFilter === "all" || !task.isCompleted;
    const matchesCategory = activeCategory === "all" || task.category === activeCategory;
    return matchesFilter && matchesCategory;
  });

  const activeTasks = filteredTasks.filter((t) => !t.isCompleted);
  const completedTasks = filteredTasks.filter((t) => t.isCompleted);
  const completionPercentage = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
    
    const task = tasks.find((t) => t.id === id);
    if (task) {
      toast({
        title: task.isCompleted ? "Task reopened" : "Task completed! 🎉",
        description: task.isCompleted ? task.title : `Great job completing "${task.title}"`,
      });
    }
  };

  const handleSaveTask = (task: any) => {
    if (task.id && tasks.find((t) => t.id === task.id)) {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
      toast({ title: "Task updated", description: "Your task has been updated successfully." });
    } else {
      setTasks([...tasks, task]);
      toast({ title: "Task created", description: "New task added to your list." });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Tasks" />
      <PageContainer className="pb-24">
        {/* Progress Section */}
        <div className="mb-6 p-4 rounded-lg bg-card border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Today's Progress</h3>
            <span className="text-sm text-muted-foreground">
              {completedTasks.length} of {tasks.length} completed
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Keep going! You're making great progress.
          </p>
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
          {activeTasks.length > 0 ? (
            activeTasks.map((task) => (
              <TaskListItem
                key={task.id}
                {...task}
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
                    {...task}
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
