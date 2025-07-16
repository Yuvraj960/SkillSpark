
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCredits } from "@/context/CreditsContext";
import { useSessions } from "@/context/SessionsContext";
import Navbar from "@/components/Navbar";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ClientProfile: React.FC = () => {
  const { user } = useAuth();
  const { credits } = useCredits();
  const { getUserSessions, cancelSession } = useSessions();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const userSessions = getUserSessions();
  const upcomingSessions = userSessions.filter(session => session.status === "upcoming");
  const completedSessions = userSessions.filter(session => session.status === "completed");
  const totalCreditsSpent = userSessions.reduce((total, session) => total + session.credits, 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-[1fr_2fr] lg:gap-12">
            {/* Profile Card */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://github.com/shadcn.png" alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="clients-gradient text-black">Client</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">About Me</h3>
                    <p className="text-sm text-muted-foreground">
                      Enthusiastic learner eager to gain new skills and knowledge.
                      I'm particularly interested in web development and design.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Contact</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Credits</h3>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate('/clients/payments')}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Credits
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-primary/10 rounded-lg">
                        <p className="text-2xl font-bold text-primary">{credits}</p>
                        <p className="text-xs text-muted-foreground">Available Credits</p>
                      </div>
                      <div className="text-center p-3 bg-secondary/10 rounded-lg">
                        <p className="text-2xl font-bold text-secondary-foreground">{totalCreditsSpent}</p>
                        <p className="text-xs text-muted-foreground">Used Credits</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-foreground">{completedSessions.length}</p>
                        <p className="text-xs text-muted-foreground">Sessions Completed</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-foreground">{upcomingSessions.length}</p>
                        <p className="text-xs text-muted-foreground">Upcoming Sessions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Sessions Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Sessions</h2>
                <Button 
                  onClick={() => navigate('/clients/book-sparky')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Book a Sparky
                </Button>
              </div>
              
              {/* Upcoming Sessions */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Upcoming Sessions</h3>
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <Card key={session.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-medium">{session.title}</h4>
                              <p className="text-muted-foreground">with {session.sparkyName}</p>
                              <p className="text-sm mt-1">{formatDate(session.date)}</p>
                              <p className="text-sm text-primary font-medium">{session.credits} credits</p>
                            </div>
                            <Badge>Upcoming</Badge>
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm">Reschedule</Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => cancelSession(session.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center py-8">
                      <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
                      <Button 
                        onClick={() => navigate('/clients/book-sparky')} 
                        variant="link" 
                        className="text-primary mt-2"
                      >
                        Book a session
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Completed Sessions */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Completed Sessions</h3>
                {completedSessions.length > 0 ? (
                  <div className="space-y-4">
                    {completedSessions.map((session) => (
                      <Card key={session.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-medium">{session.title}</h4>
                              <p className="text-muted-foreground">with {session.sparkyName}</p>
                              <p className="text-sm mt-1">{formatDate(session.date)}</p>
                              <p className="text-sm text-primary font-medium">{session.credits} credits</p>
                            </div>
                            <Badge variant="outline">Completed</Badge>
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm">Leave Review</Button>
                            <Button variant="outline" size="sm">Book Again</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center py-8">
                      <p className="text-muted-foreground">No completed sessions yet.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientProfile;
