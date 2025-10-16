import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <main className={cn("container min-h-screen px-4 pb-20 pt-4", className)}>
      {children}
    </main>
  );
};
