import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Project } from "@/types";
import { Calendar, PlusCircle, Clock, DollarSign } from "lucide-react";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";

// Mock projects data
const mockProjects: Project[] = [
  {
    id: "1",
    clientId: "client1",
    clientName: "Tech Innovators",
    title: "E-commerce Platform Development",
    description: "We need an e-commerce platform with product listings, shopping cart, and payment integration.",
    requirements: ["React", "Node.js", "Payment Gateway Integration", "Responsive Design"],
    budget: 250,
    deadline: "2025-06-25",
    status: "open",
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
    status: "open",
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
    status: "open",
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

const OpenProjects: React.FC = () => {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadProjects = () => {
      setLoading(true);
      // In a real app, this would fetch from an API
      // For now, we'll use mock data
      setTimeout(() => {
        setProjects(mockProjects);
        setLoading(false);
      }, 800);
    };
    
    loadProjects();
  }, []);

  const handleCreateProject = () => {
    navigate("/clients/create-project");
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/clients/project/${projectId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto py-10 px-4 flex-1">
          <div className="text-center py-10">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10 px-4 flex-1">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Open Projects</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Browse available projects or post your own</p>
          </div>
          
          {userType === 'client' && (
            <Button onClick={handleCreateProject} className="bg-skillspark-purple hover:bg-skillspark-darkpurple">
              <PlusCircle className="mr-2 h-4 w-4" />
              Post a New Project
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <CardDescription className="mt-1">Posted by {project.clientName}</CardDescription>
                    </div>
                    <Badge className={project.status === 'open' ? 'bg-green-500' : 'bg-yellow-500'}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.requirements.map((req, index) => (
                      <Badge key={index} variant="outline">{req}</Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
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
                      <span>Bids: {project.bids.length}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-gray-50 dark:bg-gray-900">
                  <Button
                    onClick={() => handleViewProject(project.id)}
                    className="bg-skillspark-purple hover:bg-skillspark-darkpurple w-full"
                  >
                    {userType === 'sparky' ? 'View & Place Bid' : 'View Details'}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No open projects at the moment.</p>
              {userType === 'client' && (
                <Button 
                  onClick={handleCreateProject} 
                  className="mt-4 bg-skillspark-purple hover:bg-skillspark-darkpurple"
                >
                  Post Your First Project
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenProjects;
