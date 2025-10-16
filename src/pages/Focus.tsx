import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PageContainer } from "@/components/layout/PageContainer";

const Focus = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Focus Timer" />
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Focus timer - Coming soon</p>
        </div>
      </PageContainer>
      <BottomNavigation />
    </div>
  );
};

export default Focus;
