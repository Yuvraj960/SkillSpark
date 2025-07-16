
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

const categories = [
  { value: "programming", label: "Programming & Development" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "business", label: "Business" },
  { value: "personal", label: "Personal Development" },
  { value: "music", label: "Music" },
  { value: "language", label: "Languages" },
  { value: "other", label: "Other" },
];

const AddSkill: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [sessionLength, setSessionLength] = useState("");
  const [creditsRequired, setCreditsRequired] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!title || !description || !category || !sessionLength || !creditsRequired) {
      toast({ 
        title: "Error", 
        description: "All fields are required", 
        variant: "destructive" 
      });
      setIsSubmitting(false);
      return;
    }

    // Mock submission
    setTimeout(() => {
      toast({ 
        title: "Success", 
        description: "Your skill has been added successfully!" 
      });
      setIsSubmitting(false);
      navigate("/sparkies/profile");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Add a New Skill</CardTitle>
              <CardDescription>
                Share your expertise with others and earn credits by teaching your skills
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Skill Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Advanced JavaScript, UI/UX Design, Digital Marketing"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you can teach and your experience in this field..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="session-length">Session Length (minutes)</Label>
                    <Select value={sessionLength} onValueChange={setSessionLength}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="credits">Credits Required</Label>
                  <Input
                    id="credits"
                    type="number"
                    placeholder="How many credits to charge for this skill session"
                    value={creditsRequired}
                    onChange={(e) => setCreditsRequired(e.target.value)}
                    min="1"
                  />
                  <p className="text-sm text-gray-500">
                    Recommended: 5-20 credits for a standard session
                  </p>
                </div>
                
                <div className="space-y-2 border-t pt-4">
                  <Label>Additional Information</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center border rounded-md p-3">
                      <input
                        type="checkbox"
                        id="remote"
                        className="mr-2"
                      />
                      <Label htmlFor="remote" className="cursor-pointer">Remote sessions available</Label>
                    </div>
                    <div className="flex items-center border rounded-md p-3">
                      <input
                        type="checkbox"
                        id="group"
                        className="mr-2"
                      />
                      <Label htmlFor="group" className="cursor-pointer">Group sessions available</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/sparkies/profile')}
                  type="button"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-skillspark-purple hover:bg-skillspark-darkpurple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding Skill..." : "Add Skill"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AddSkill;
