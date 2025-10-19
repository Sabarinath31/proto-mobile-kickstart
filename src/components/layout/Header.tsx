import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title?: string;
  showAvatar?: boolean;
  showBack?: boolean;
}

export const Header = ({ title = "WhatsMind", showAvatar = true, showBack = false }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {!showBack && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => navigate("/ai-chat")}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Assistant
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/install")}>
                  Install App
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">W</span>
          </div>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        
        {showAvatar && (
          <Avatar className="h-9 w-9 cursor-pointer" onClick={() => navigate("/profile")}>
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  );
};
