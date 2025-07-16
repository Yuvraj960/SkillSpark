
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { useCredits } from "@/context/CreditsContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

// Mock fundraising campaigns
const mockCampaigns = [
  {
    id: "1",
    title: "Build Interactive Coding Platform",
    description: "Help me create an interactive platform for teaching programming to kids. This will include gamified lessons and real-time code execution.",
    creator: "Alex Chen",
    target: 500,
    raised: 320,
    backers: 28,
    daysLeft: 15,
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&auto=format&fit=crop"
  },
  {
    id: "2", 
    title: "Open Source Design System",
    description: "Creating a comprehensive design system that will be freely available to help designers and developers build consistent user interfaces.",
    creator: "Maria Rodriguez",
    target: 750,
    raised: 420,
    backers: 35,
    daysLeft: 22,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&auto=format&fit=crop"
  }
];

const ClientFundRaise: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { credits, donateCredits } = useCredits();
  const { toast } = useToast();
  const [donationAmounts, setDonationAmounts] = useState<Record<string, number>>({});

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleDonate = (campaignId: string, campaignTitle: string) => {
    const amount = donationAmounts[campaignId] || 0;
    
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive"
      });
      return;
    }

    const success = donateCredits(amount, campaignTitle);
    if (success) {
      setDonationAmounts(prev => ({ ...prev, [campaignId]: 0 }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Support Innovation</h1>
              <p className="text-muted-foreground">Help fund creative projects and learning initiatives</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Your Credits</p>
              <p className="text-2xl font-bold text-primary">{credits}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {mockCampaigns.map((campaign) => {
              const progressPercentage = (campaign.raised / campaign.target) * 100;
              
              return (
                <Card key={campaign.id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={campaign.image} 
                      alt={campaign.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl">{campaign.title}</CardTitle>
                    <CardDescription className="text-sm">by {campaign.creator}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{campaign.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{campaign.raised} credits raised</span>
                        <span>{campaign.target} credits goal</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{campaign.backers} backers</span>
                        <span>{campaign.daysLeft} days left</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Input
                        type="number"
                        placeholder="Credits to donate"
                        value={donationAmounts[campaign.id] || ''}
                        onChange={(e) => setDonationAmounts(prev => ({
                          ...prev,
                          [campaign.id]: parseInt(e.target.value) || 0
                        }))}
                        className="flex-1"
                        min="1"
                        max={credits}
                      />
                      <Button 
                        onClick={() => handleDonate(campaign.id, campaign.title)}
                        disabled={!donationAmounts[campaign.id] || donationAmounts[campaign.id] <= 0}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Donate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12">
            <Card className="p-6 bg-muted/50">
              <h2 className="text-2xl font-bold mb-4">Start Your Own Campaign</h2>
              <p className="text-muted-foreground mb-6">
                Have a project or learning initiative that needs funding? Create your own campaign and get support from the community.
              </p>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  toast({
                    title: "Feature Coming Soon",
                    description: "Campaign creation will be available soon!",
                  });
                }}
              >
                Start a Campaign
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientFundRaise;
