
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useCredits } from "@/context/CreditsContext";
import { useSessions } from "@/context/SessionsContext";
import Navbar from "@/components/Navbar";

// Mock data for sparkies and their skills
const mockSparkies = [
  {
    id: "1",
    name: "John Smith",
    title: "Senior Frontend Developer",
    rating: 4.9,
    sessionsCompleted: 48,
    skills: ["JavaScript", "React", "Vue", "CSS"],
    creditsPerHour: 15,
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    title: "UX/UI Designer",
    rating: 5.0,
    sessionsCompleted: 32,
    skills: ["Figma", "Adobe XD", "UI Design", "User Research"],
    creditsPerHour: 20,
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "3",
    name: "Michael Wilson",
    title: "Full Stack Developer",
    rating: 4.8,
    sessionsCompleted: 56,
    skills: ["Node.js", "Express", "MongoDB", "React"],
    creditsPerHour: 18,
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "4",
    name: "Emily Brown",
    title: "Digital Marketing Specialist",
    rating: 4.7,
    sessionsCompleted: 29,
    skills: ["SEO", "Content Marketing", "Social Media", "Google Analytics"],
    creditsPerHour: 16,
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "5",
    name: "David Lee",
    title: "Data Scientist",
    rating: 4.9,
    sessionsCompleted: 37,
    skills: ["Python", "Machine Learning", "Data Visualization", "Statistics"],
    creditsPerHour: 22,
    avatar: "https://github.com/shadcn.png",
  },
];

const BookSparky: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedSparky, setSelectedSparky] = useState<(typeof mockSparkies)[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { credits, spendCredits } = useCredits();
  const { bookSession } = useSessions();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredSparkies = mockSparkies.filter((sparky) => {
    const matchesSearch = searchTerm === "" || 
      sparky.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      sparky.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      sparky.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || 
      sparky.skills.some(skill => skill.toLowerCase().includes(categoryFilter.toLowerCase()));
    
    return matchesSearch && matchesCategory;
  });

  const handleBookSession = () => {
    if (!selectedDate || !selectedSparky) {
      toast({ 
        title: "Error", 
        description: "Please select a date for the session", 
        variant: "destructive" 
      });
      return;
    }

    if (credits < selectedSparky.creditsPerHour) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${selectedSparky.creditsPerHour} credits but only have ${credits}.`,
        variant: "destructive"
      });
      return;
    }

    setIsBookingSubmitting(true);

    // Simulate booking process
    setTimeout(() => {
      if (spendCredits(selectedSparky.creditsPerHour)) {
        const success = bookSession(
          selectedSparky.id,
          selectedSparky.name,
          `Session with ${selectedSparky.name}`,
          selectedDate,
          selectedSparky.creditsPerHour
        );

        setIsBookingSubmitting(false);
        
        if (success) {
          setSelectedSparky(null);
          setSelectedDate(undefined);
          setIsDialogOpen(false);
          
          toast({
            title: "Session Booked Successfully",
            description: `Your session with ${selectedSparky.name} has been booked!`,
          });
          
          // Redirect to profile
          navigate('/clients/profile');
        }
      } else {
        setIsBookingSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Book a Sparky</h1>
              <p className="text-muted-foreground">Find the perfect expert to help you learn new skills</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Your Credits</p>
              <p className="text-2xl font-bold text-primary">{credits}</p>
            </div>
          </div>
          
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Input
                placeholder="Search for skills or sparkies..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="design">UI Design</SelectItem>
                <SelectItem value="node">Node.js</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Sparkies List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSparkies.map((sparky) => (
              <Card key={sparky.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={sparky.avatar} alt={sparky.name} />
                        <AvatarFallback>{sparky.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{sparky.name}</h3>
                        <p className="text-sm text-muted-foreground">{sparky.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center">
                            <span className="text-amber-500 mr-1">★</span>
                            {sparky.rating}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{sparky.sessionsCompleted} sessions</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1 mb-4">
                        {sparky.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-muted">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-primary">{sparky.creditsPerHour} credits / hour</span>
                        <Dialog open={isDialogOpen && selectedSparky?.id === sparky.id} onOpenChange={(open) => {
                          setIsDialogOpen(open);
                          if (!open) {
                            setSelectedSparky(null);
                            setSelectedDate(undefined);
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              className="bg-primary hover:bg-primary/90"
                              onClick={() => {
                                setSelectedSparky(sparky);
                                setIsDialogOpen(true);
                              }}
                            >
                              Book Session
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Book a Session with {selectedSparky?.name}</DialogTitle>
                              <DialogDescription>
                                Select a date for your session. You can discuss specific times after booking.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="flex flex-col items-center gap-2">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  className="rounded-md border"
                                  disabled={(date) => {
                                    // Disable dates in the past
                                    return date < new Date(new Date().setHours(0, 0, 0, 0));
                                  }}
                                />
                              </div>
                              <div className="flex flex-col gap-2 text-center">
                                <p className="font-medium">Session Credits:</p>
                                <p className="text-2xl font-bold text-primary">
                                  {selectedSparky?.creditsPerHour} credits
                                </p>
                                <p className="text-sm text-muted-foreground">for a 1 hour session</p>
                                <div className="mt-2 p-3 bg-muted rounded-lg">
                                  <p className="text-sm font-medium">Your Credits: {credits}</p>
                                  {selectedSparky && credits < selectedSparky.creditsPerHour && (
                                    <p className="text-sm text-destructive mt-1">
                                      Insufficient credits! You need {selectedSparky.creditsPerHour - credits} more credits.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button 
                                onClick={handleBookSession}
                                className="w-full bg-primary hover:bg-primary/90"
                                disabled={!selectedDate || isBookingSubmitting || (selectedSparky && credits < selectedSparky.creditsPerHour)}
                              >
                                {isBookingSubmitting ? "Booking..." : "Confirm Booking"}
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
            
            {filteredSparkies.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-muted-foreground">No sparkies found matching your criteria</p>
                <p className="mt-2 text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookSparky;
