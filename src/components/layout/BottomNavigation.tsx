import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, CheckSquare, Timer, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: Timer, label: "Focus", path: "/focus" },
  { icon: User, label: "Profile", path: "/profile" },
];

export const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/98 backdrop-blur-sm shadow-lg">
      <div className="container flex h-20 items-center justify-around px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 rounded-xl px-4 py-2.5 transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-6 w-6 transition-transform", isActive && "scale-110")} />
              <span className={cn("text-xs font-medium", isActive && "font-semibold")}>
                {item.label}
              </span>
              {/* Subtle indicator dot for active state */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
