import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Project, Bid } from "@/types";
import { Calendar, Clock, DollarSign, Check } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

// Mock projects data - same as in OpenProjects.tsx
const mockProjects = [
  {
    id: "1",
    clientId: "client1",
    clientName: "Tech Innovators",
    title: "E-commerce Platform Development",
    description: "We need an e-commerce platform with product listings, shopping cart, and payment integration.",
    requirements: ["React", "Node.js", "Payment Gateway Integration", "Responsive Design"],
    budget: 250,
    deadline: "2025-06-25",
    status: "open" as const,
    createdAt: "2025-05-15T10:00:00Z",
    bids: [
      {
        id: "bid1",
        projectId: "1",
        sparkyId: "sparky1",
        sparkyName: "John Developer",
        sparkyAvatar: "https://github.com/shadcn.png",
        sparkyRating: 4.9,
        amount: 220,
        proposal: "I can build this platform using React and Node.js with all the required features.",
        estimatedDuration: "3 weeks",
        status: "pending",
        createdAt: "2025-05-16T12:00:00Z"
      }
    ]
  },
  {
    id: "2",
    clientId: "client2",
    clientName: "Digital Marketing Agency",
    title: "Marketing Dashboard UI",
    description: "A dashboard to visualize marketing KPIs and campaign performance.",
    requirements: ["Figma Design", "React", "Data Visualization", "Responsive UI"],
    budget: 180,
    deadline: "2025-06-10",
    status: "open" as const,
    createdAt: "2025-05-14T15:00:00Z",
    bids: []
  },
  {
    id: "3",
    clientId: "client3",
    clientName: "EdTech Startup",
    title: "Online Learning Platform Enhancement",
    description: "Add new features to our existing learning platform including video lessons and quizzes.",
    requirements: ["React", "TypeScript", "Video Integration", "Quiz Builder"],
    budget: 320,
    deadline: "2025-07-05",
    status: "open" as const,
    createdAt: "2025-05-12T09:30:00Z",
    bids: [
      {
        id: "bid2",
        projectId: "3",
        sparkyId: "sparky2",
        sparkyName: "Jane Engineer",
        sparkyAvatar: "https://github.com/shadcn.png",
        sparkyRating: 4.8,
        amount: 310,
        proposal: "I specialize in EdTech platforms and can enhance your existing system with all requested features.",
        estimatedDuration: "4 weeks",
        status: "pending",
        createdAt: "2025-05-13T14:20:00Z"
      },
      {
        id: "bid3",
        projectId: "3",
        sparkyId: "sparky3",
        sparkyName: "Alex Developer",
        sparkyAvatar: "https://github.com/shadcn.png",
        sparkyRating: 4.7,
        amount: 290,
        proposal: "I have extensive experience with video integration and quiz systems. Can deliver in 3 weeks.",
        estimatedDuration: "3 weeks",
        status: "pending",
        createdAt: "2025-05-14T10:15:00Z"
      }
    ]
  }
];

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidProposal, setBidProposal] = useState<string>("");
  const [estimatedDuration, setEstimatedDuration] = useState<string>("");
  const [submittingBid, setSubmittingBid] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadProject = () => {
      setLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        const foundProject = mockProjects.find(p => p.id === id);
        if (foundProject) {
          setProject(foundProject as Project);
          // Pre-fill bid amount with a reasonable default
          setBidAmount(foundProject.budget - 10);
        }
        setLoading(false);
      }, 500);
    };

    loadProject();
  }, [id]);

  const handlePlaceBid = () => {
    if (!user || !project) return;

    setSubmittingBid(true);
    
    // Validate inputs
    if (!bidAmount || !bidProposal || !estimatedDuration) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields in your bid.",
        variant: "destructive",
      });
      setSubmittingBid(false);
      return;
    }

    // In a real app, this would be an API call
    setTimeout(() => {
      // Create a new bid
      const newBid: Bid = {
        id: `bid-${Date.now()}`,
        projectId: project.id,
        sparkyId: user.id,
        sparkyName: user.name,
        sparkyAvatar: "https://github.com/shadcn.png", // Use actual avatar in real app
        sparkyRating: 5.0, // Mock rating
        amount: bidAmount,
        proposal: bidProposal,
        estimatedDuration: estimatedDuration,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      // Update the project with the new bid
      const updatedProject = {
        ...project,
        bids: [...project.bids, newBid]
      };

      setProject(updatedProject as Project);
      setShowBidForm(false);
      
      toast({
        title: "Bid placed successfully!",
        description: "The client will review your proposal.",
      });
      
      setSubmittingBid(false);
    }, 1000);
  };

  const handleAcceptBid = (bidId: string) => {
    if (!project) return;
    
    // In a real app, this would be an API call
    setTimeout(() => {
      // Update the project status and the accepted bid
      const updatedBids = project.bids.map(bid => ({
        ...bid,
        status: bid.id === bidId ? "accepted" : "rejected"
      }));
      
      const updatedProject = {
        ...project,
        status: "assigned" as const,
        assignedSparkyId: project.bids.find(b => b.id === bidId)?.sparkyId,
        bids: updatedBids
      };
      
      setProject(updatedProject as Project);
      
      toast({
        title: "Bid accepted!",
        description: "The Sparky has been notified about your decision.",
      });
    }, 800);
  };

  const userHasBidOnProject = () => {
    if (!user || !project) return false;
    return project.bids.some(bid => bid.sparkyId === user.id);
  };

  if (loading || !project) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto py-10 px-4 flex-1">
          <div className="text-center py-10">Loading project details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10 px-4 flex-1">
        <Button
          variant="outline"
          onClick={() => navigate("/clients/open-projects")}
          className="mb-6"
        >
          ← Back to Projects
        </Button>
        
        <div className="grid md:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-6">
            {/* Project Details Card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{project.title}</CardTitle>
                    <CardDescription className="mt-1">Posted by {project.clientName}</CardDescription>
                  </div>
                  <Badge className={project.status === 'open' ? 'bg-green-500' : 'bg-yellow-500'}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.requirements.map((req, index) => (
                      <Badge key={index} variant="outline">{req}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-skillspark-purple" />
                    <span>Budget: {project.budget} credits</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-skillspark-purple" />
                    <span>Deadline: {format(parseISO(project.deadline), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-skillspark-purple" />
                    <span>Posted: {format(parseISO(project.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </CardContent>
              
              {userType === 'sparky' && project.status === 'open' && (
                <CardFooter className="border-t bg-gray-50 dark:bg-gray-900 flex justify-between">
                  {userHasBidOnProject() ? (
                    <p className="text-skillspark-purple py-2">You've already placed a bid on this project</p>
                  ) : (
                    <>
                      {showBidForm ? (
                        <Button 
                          variant="outline" 
                          onClick={() => setShowBidForm(false)}
                        >
                          Cancel Bid
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => setShowBidForm(true)}
                          className="bg-skillspark-purple hover:bg-skillspark-darkpurple"
                        >
                          Place a Bid
                        </Button>
                      )}
                    </>
                  )}
                </CardFooter>
              )}
            </Card>
            
            {/* Bid Form */}
            {userType === 'sparky' && showBidForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Place Your Bid</CardTitle>
                  <CardDescription>Tell the client why you're the perfect match for this project</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="bid-amount" className="text-sm font-medium">
                        Your Bid (Credits)
                      </label>
                      <Input
                        id="bid-amount"
                        type="number"
                        value={bidAmount}
                        onChange={e => setBidAmount(Number(e.target.value))}
                        min={1}
                        max={project.budget * 1.5}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="estimated-duration" className="text-sm font-medium">
                        Estimated Duration
                      </label>
                      <Input
                        id="estimated-duration"
                        placeholder="e.g., 2 weeks"
                        value={estimatedDuration}
                        onChange={e => setEstimatedDuration(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="proposal" className="text-sm font-medium">
                      Your Proposal
                    </label>
                    <Textarea
                      id="proposal"
                      placeholder="Explain why you're the best fit for this project and how you plan to deliver it..."
                      value={bidProposal}
                      onChange={e => setBidProposal(e.target.value)}
                      rows={5}
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="border-t bg-gray-50 dark:bg-gray-900">
                  <Button
                    onClick={handlePlaceBid}
                    className="bg-skillspark-purple hover:bg-skillspark-darkpurple ml-auto"
                    disabled={submittingBid}
                  >
                    {submittingBid ? "Submitting..." : "Submit Bid"}
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Bids List - Only visible to project client */}
            {(userType === 'client' && user?.id === project.clientId) && (
              <Card>
                <CardHeader>
                  <CardTitle>Bids ({project.bids.length})</CardTitle>
                  <CardDescription>Review and select the best Sparky for your project</CardDescription>
                </CardHeader>
                
                <CardContent>
                  {project.bids.length > 0 ? (
                    <div className="space-y-4">
                      {project.bids.map((bid) => (
                        <div key={bid.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={bid.sparkyAvatar} alt={bid.sparkyName} />
                                <AvatarFallback>{bid.sparkyName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{bid.sparkyName}</h4>
                                <div className="flex items-center text-sm">
                                  <span className="text-amber-500 mr-1">★</span>
                                  <span>{bid.sparkyRating}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-bold text-lg">{bid.amount} credits</p>
                              <p className="text-sm text-gray-500">{bid.estimatedDuration}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 text-gray-600 dark:text-gray-300">
                            <p>{bid.proposal}</p>
                          </div>
                          
                          <div className="mt-4 flex justify-end gap-2">
                            {project.status === 'open' ? (
                              <Button
                                onClick={() => handleAcceptBid(bid.id)}
                                className="bg-skillspark-purple hover:bg-skillspark-darkpurple gap-1"
                              >
                                <Check className="h-4 w-4" /> Accept Bid
                              </Button>
                            ) : (
                              <Badge className={bid.status === 'accepted' ? 'bg-green-500' : 'bg-gray-400'}>
                                {bid.status === 'accepted' ? 'Accepted' : 'Rejected'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No bids on this project yet.</p>
                      <p className="mt-2 text-sm">Check back later for updates.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{project.clientName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{project.clientName}</h4>
                    <p className="text-sm text-gray-500">Member since {format(parseISO(project.createdAt), 'MMM yyyy')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Project Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <Badge className={project.status === 'open' ? 'bg-green-500' : 'bg-yellow-500'}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bids:</span>
                    <span>{project.bids.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Budget:</span>
                    <span>{project.budget} credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Posted:</span>
                    <span>{format(parseISO(project.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deadline:</span>
                    <span>{format(parseISO(project.deadline), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Similar Projects Card */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProjects
                    .filter(p => p.id !== project.id)
                    .slice(0, 2)
                    .map(p => (
                      <div 
                        key={p.id} 
                        className="border-b pb-3 last:border-0" 
                        onClick={() => navigate(`/clients/project/${p.id}`)}
                        role="button"
                      >
                        <h4 className="font-medium hover:text-skillspark-purple cursor-pointer">
                          {p.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">{p.budget} credits • {p.bids.length} bids</p>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
