
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { HandHeart } from "lucide-react";

// Mock data for campaigns
const initialMockCampaigns = [
  {
    id: "1",
    title: "Advanced Web Development Course Creation",
    description: "I'm raising funds to create a comprehensive web development course that will be available to all clients on SkillSpark.",
    goal: 500,
    raised: 320,
    backers: 18,
    daysLeft: 14,
  },
  {
    id: "2",
    title: "Equipment for Professional Video Tutorials",
    description: "Help me purchase better recording equipment to improve the quality of my programming tutorial sessions.",
    goal: 300,
    raised: 85,
    backers: 7,
    daysLeft: 21,
  }
];

const SparkyFundRaise: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaigns, setCampaigns] = useState(initialMockCampaigns);
  const [activeTab, setActiveTab] = useState("campaigns");
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user || user.type !== "sparky") {
    navigate("/login");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!title || !description || !goal || !duration) {
      toast({ 
        title: "Error", 
        description: "All fields are required", 
        variant: "destructive" 
      });
      setIsSubmitting(false);
      return;
    }

    // Create a new campaign
    setTimeout(() => {
      const newCampaign = {
        id: `new-${Date.now()}`,
        title,
        description,
        goal: parseInt(goal),
        raised: 0,
        backers: 0,
        daysLeft: parseInt(duration),
      };
      
      setCampaigns(prev => [newCampaign, ...prev]);
      
      toast({ 
        title: "Success", 
        description: "Your fundraising campaign has been created!" 
      });
      setIsSubmitting(false);
      
      // Reset form
      setTitle("");
      setDescription("");
      setGoal("");
      setDuration("");
      
      // Switch to campaigns tab
      setActiveTab("campaigns");
    }, 1000);
  };
  
  const handleEditCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      toast({ 
        title: "Edit Campaign", 
        description: `Now editing: ${campaign.title}` 
      });
      
      // In a real app, this would populate the form with campaign data
      setActiveTab("create");
      setTitle(campaign.title);
      setDescription(campaign.description);
      setGoal(campaign.goal.toString());
      setDuration(campaign.daysLeft.toString());
    }
  };
  
  const handleViewDetails = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      toast({ 
        title: "Campaign Details", 
        description: `Viewing details for: ${campaign.title}` 
      });
      
      // In a real app, this would navigate to a detailed view
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-6">Fundraising</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
              <TabsTrigger value="create">Create Campaign</TabsTrigger>
            </TabsList>
            
            <TabsContent value="campaigns">
              <div className="grid gap-6">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
                      <p className="text-gray-500 mb-4">{campaign.description}</p>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{campaign.raised} credits raised</span>
                            <span>Goal: {campaign.goal} credits</span>
                          </div>
                          <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>{campaign.backers} backers</span>
                          <span>{campaign.daysLeft} days left</span>
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditCampaign(campaign.id)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(campaign.id)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {campaigns.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center py-10">
                      <p className="text-gray-500">You don't have any active fundraising campaigns.</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Create one to start raising credits for your projects!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create a Fundraising Campaign</CardTitle>
                  <CardDescription>
                    Raise credits from the SkillSpark community to fund your projects
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Campaign Title</Label>
                      <Input
                        id="title"
                        placeholder="Give your fundraising campaign a clear title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Campaign Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what you're raising credits for and why people should support you..."
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="goal">Credit Goal</Label>
                        <Input
                          id="goal"
                          type="number"
                          placeholder="How many credits do you need?"
                          value={goal}
                          onChange={(e) => setGoal(e.target.value)}
                          min="1"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="duration">Campaign Duration (days)</Label>
                        <Input
                          id="duration"
                          type="number"
                          placeholder="How long will your campaign run?"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          min="1"
                          max="60"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 border-t pt-4">
                      <Label>Campaign Visibility</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center border rounded-md p-3">
                          <input
                            type="radio"
                            id="public"
                            name="visibility"
                            className="mr-2"
                            defaultChecked
                          />
                          <Label htmlFor="public" className="cursor-pointer">Public (visible to all)</Label>
                        </div>
                        <div className="flex items-center border rounded-md p-3">
                          <input
                            type="radio"
                            id="private"
                            name="visibility"
                            className="mr-2"
                          />
                          <Label htmlFor="private" className="cursor-pointer">Private (by invitation)</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-skillspark-purple hover:bg-skillspark-darkpurple"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SparkyFundRaise;
