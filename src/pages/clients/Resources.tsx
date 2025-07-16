import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

// Mock data for resources
const mockArticles = [
  {
    id: "1",
    title: "Getting Started with React",
    category: "Programming",
    author: "John Smith",
    date: "2023-05-28",
    readTime: 8,
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "2",
    title: "UI Design Principles Everyone Should Know",
    category: "Design",
    author: "Sarah Johnson",
    date: "2023-06-02",
    readTime: 12,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "3",
    title: "Career Growth in Tech Industry",
    category: "Career",
    author: "Michael Wilson",
    date: "2023-06-05",
    readTime: 10,
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

const mockVideos = [
  {
    id: "1",
    title: "JavaScript Fundamentals Tutorial",
    category: "Programming",
    author: "David Lee",
    date: "2023-05-15",
    duration: 45,
    thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "2",
    title: "Introduction to Digital Marketing",
    category: "Marketing",
    author: "Emily Brown",
    date: "2023-06-01",
    duration: 35,
    thumbnail: "https://images.unsplash.com/photo-1582547230480-aef42a5f7ab0?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "3",
    title: "Personal Branding Workshop",
    category: "Career",
    author: "Robert Chen",
    date: "2023-06-10",
    duration: 60,
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

const Resources: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-2">Learning Resources</h1>
          <p className="text-muted-foreground mb-6">Explore our collection of articles, videos, and tutorials</p>
          
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="flex-1 w-full">
              <Input placeholder="Search resources..." />
            </div>
            <div className="flex gap-2 flex-wrap justify-center md:justify-start">
              <Button variant="outline" size="sm">All</Button>
              <Button variant="outline" size="sm">Programming</Button>
              <Button variant="outline" size="sm">Design</Button>
              <Button variant="outline" size="sm">Career</Button>
              <Button variant="outline" size="sm">Marketing</Button>
            </div>
          </div>
          
          <Tabs defaultValue="articles" className="space-y-8">
            <TabsList className="mb-6">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="interactive">Interactive Lessons</TabsTrigger>
            </TabsList>
            
            <TabsContent value="articles" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockArticles.map((article) => (
                  <Card key={article.id} className="overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <Badge className="self-start mb-2">{article.category}</Badge>
                      <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                      <div className="text-sm text-muted-foreground mt-auto pt-4 flex justify-between items-center">
                        <span>By {article.author}</span>
                        <span>{article.readTime} min read</span>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-primary p-0 mt-4 justify-start"
                        onClick={() => navigate(`/clients/resources/${article.id}`)}
                      >
                        Read Article
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="videos" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockVideos.map((video) => (
                  <Card key={video.id} className="overflow-hidden flex flex-col">
                    <div className="aspect-video w-full overflow-hidden relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-8 w-8 text-skillspark-purple" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                            />
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <Badge className="self-start mb-2">{video.category}</Badge>
                      <h3 className="text-xl font-bold mb-2">{video.title}</h3>
                      <div className="text-sm text-gray-500 mt-auto pt-4 flex justify-between items-center">
                        <span>By {video.author}</span>
                        <span>{video.duration} min</span>
                      </div>
                      <Button variant="link" className="text-skillspark-purple p-0 mt-4 justify-start">
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="interactive" className="space-y-6">
              <Card className="p-6 text-center py-12">
                <CardHeader>
                  <CardTitle>Interactive Lessons Coming Soon!</CardTitle>
                  <CardDescription>
                    We're working on bringing you interactive learning experiences. Stay tuned!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>Get Notified When Available</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 bg-primary/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Want personalized learning?</h2>
            <p className="mb-6">Book a session with one of our Sparkies for tailored guidance</p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate('/clients/book-sparky')}
            >
              Find a Sparky
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Resources;
