import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <main className={cn("container min-h-screen px-6 pb-24 pt-6", className)}>
      {children}
    </main>
  );
};
