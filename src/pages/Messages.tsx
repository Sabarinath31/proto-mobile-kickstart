import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PageContainer } from "@/components/layout/PageContainer";

const Messages = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Messages" />
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Messages page - Coming soon</p>
        </div>
      </PageContainer>
      <BottomNavigation />
    </div>
  );
};

export default Messages;
