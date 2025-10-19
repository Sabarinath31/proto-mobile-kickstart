import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/PageContainer";
import { Download, Smartphone, Zap, Bell, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Install = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Already installed",
        description: "WhatsMind is already installed on your device or can't be installed from this browser.",
      });
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      toast({
        title: "Installation successful!",
        description: "WhatsMind has been installed on your device.",
      });
      navigate("/");
    }
    
    setDeferredPrompt(null);
    setCanInstall(false);
  };

  const features = [
    {
      icon: Smartphone,
      title: "Works Offline",
      description: "Access your messages and tasks even without internet connection",
    },
    {
      icon: Zap,
      title: "Fast & Lightweight",
      description: "Optimized for speed with instant loading and smooth performance",
    },
    {
      icon: Bell,
      title: "Push Notifications",
      description: "Get gentle reminders for tasks and messages without being overwhelmed",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageContainer>
        <div className="max-w-2xl mx-auto py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Download className="h-10 w-10 text-primary" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">Install WhatsMind</h1>
            <p className="text-xl text-muted-foreground">
              Get the full app experience on your device
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Progressive Web App</CardTitle>
              <CardDescription>
                WhatsMind works like a native app but without the app store hassle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                {features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t">
                {canInstall ? (
                  <Button onClick={handleInstall} size="lg" className="w-full">
                    <Download className="mr-2 h-5 w-5" />
                    Install WhatsMind
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                      To install WhatsMind on your device:
                    </p>
                    <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                      <p><strong>On iOS/Safari:</strong> Tap the Share button, then "Add to Home Screen"</p>
                      <p><strong>On Android/Chrome:</strong> Tap the menu (⋮) and select "Install app"</p>
                      <p><strong>On Desktop:</strong> Look for the install icon in your browser's address bar</p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Continue in browser
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Installing WhatsMind gives you the best experience with offline access,
              faster loading, and native-like features.
            </p>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default Install;
