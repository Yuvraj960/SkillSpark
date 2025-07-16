
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

// Mock data for mentors
const mockMentors = [
  {
    id: "1",
    name: "Dr. Robert Chen",
    title: "Tech Industry Expert",
    experience: "15+ years in tech leadership",
    specialties: ["Career Development", "Tech Industry", "Leadership"],
    creditsPerSession: 30,
    availability: "2-3 days",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "2",
    name: "Prof. Maria Garcia",
    title: "Computer Science Professor",
    experience: "20+ years in academia and research",
    specialties: ["Academic Guidance", "Research", "Computer Science"],
    creditsPerSession: 25,
    availability: "1-2 days",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "3",
    name: "James Wilson",
    title: "Startup Advisor",
    experience: "Founded 3 tech startups",
    specialties: ["Entrepreneurship", "Product Strategy", "Funding"],
    creditsPerSession: 35,
    availability: "3-4 days",
    avatar: "https://github.com/shadcn.png",
  },
];

const ConsultMentor: React.FC = () => {
  const [selectedMentor, setSelectedMentor] = useState<(typeof mockMentors)[0] | null>(null);
  const [consultationMessage, setConsultationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmitConsultation = () => {
    if (!consultationMessage.trim()) {
      toast({ 
        title: "Error", 
        description: "Please describe what you'd like to discuss", 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);

    // Mock consultation request
    setTimeout(() => {
      toast({ 
        title: "Success", 
        description: `Your consultation request with ${selectedMentor?.name} has been sent!` 
      });
      setIsSubmitting(false);
      setConsultationMessage("");
      setSelectedMentor(null);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Consult a Mentor</h1>
            <p className="text-gray-500 mb-8">Get personalized guidance from experienced industry professionals</p>
            
            <div className="space-y-8">
              {mockMentors.map((mentor) => (
                <Card key={mentor.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center md:items-start">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={mentor.avatar} alt={mentor.name} />
                          <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="mt-2 text-center md:text-left">
                          <Badge variant="outline" className="bg-skillspark-softgray">
                            {mentor.availability} response time
                          </Badge>
                        </p>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold">{mentor.name}</h2>
                          <p className="text-gray-500">{mentor.title}</p>
                          <p className="text-sm mt-1">{mentor.experience}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-1">Specialties</h3>
                          <div className="flex flex-wrap gap-2">
                            {mentor.specialties.map((specialty, index) => (
                              <Badge key={index} variant="secondary">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <p className="font-bold">{mentor.creditsPerSession} credits per consultation</p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                className="bg-skillspark-purple hover:bg-skillspark-darkpurple"
                                onClick={() => setSelectedMentor(mentor)}
                              >
                                Request Consultation
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Request Consultation with {selectedMentor?.name}</DialogTitle>
                                <DialogDescription>
                                  Describe what you'd like to discuss with the mentor
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <Textarea 
                                  placeholder="I'd like to discuss my career path in software development and get advice on..."
                                  rows={6}
                                  value={consultationMessage}
                                  onChange={(e) => setConsultationMessage(e.target.value)}
                                />
                                <div className="text-center space-y-2">
                                  <p className="font-medium">Consultation Fee:</p>
                                  <p className="text-2xl font-bold text-skillspark-purple">
                                    {selectedMentor?.creditsPerSession} credits
                                  </p>
                                  <p className="text-sm text-gray-500">You currently have 75 credits available</p>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  onClick={handleSubmitConsultation}
                                  className="w-full bg-skillspark-purple hover:bg-skillspark-darkpurple"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? "Sending Request..." : "Send Consultation Request"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 p-6 bg-skillspark-softgray rounded-lg text-center">
              <h2 className="text-xl font-bold mb-2">How Mentorship Works</h2>
              <div className="grid gap-6 md:grid-cols-3 mt-6">
                <div className="flex flex-col items-center p-4">
                  <div className="h-12 w-12 rounded-full bg-skillspark-purple flex items-center justify-center text-white font-bold text-lg mb-4">
                    1
                  </div>
                  <h3 className="font-medium mb-2">Choose a Mentor</h3>
                  <p className="text-sm text-gray-500">
                    Select a mentor based on their expertise and specialization
                  </p>
                </div>
                <div className="flex flex-col items-center p-4">
                  <div className="h-12 w-12 rounded-full bg-skillspark-purple flex items-center justify-center text-white font-bold text-lg mb-4">
                    2
                  </div>
                  <h3 className="font-medium mb-2">Submit Request</h3>
                  <p className="text-sm text-gray-500">
                    Describe what you'd like to discuss in your consultation
                  </p>
                </div>
                <div className="flex flex-col items-center p-4">
                  <div className="h-12 w-12 rounded-full bg-skillspark-purple flex items-center justify-center text-white font-bold text-lg mb-4">
                    3
                  </div>
                  <h3 className="font-medium mb-2">Get Guidance</h3>
                  <p className="text-sm text-gray-500">
                    Connect with your mentor via video call for personalized advice
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConsultMentor;
