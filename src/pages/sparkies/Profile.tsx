import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { ExternalLink, Github } from "lucide-react";
import { SparkyProfile } from "@/types";
import Navbar from "@/components/Navbar";

const SparkyProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<SparkyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Load profile data
    const loadProfile = () => {
      setLoading(true);
      // In a real app, this would be an API call
      const storedProfile = localStorage.getItem(`${user.id}-profile`);
      
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile);
          // Mock the skill data if not present
          const mockSkills = parsedProfile.skills || [
            {
              id: "1",
              name: "JavaScript Programming",
              description: "Advanced JavaScript techniques and best practices",
              ratings: 4.9,
              sessions: 24,
            },
            {
              id: "2",
              name: "React Development",
              description: "Building complex UI with React and state management",
              ratings: 4.8,
              sessions: 18,
            },
            {
              id: "3",
              name: "UI/UX Design",
              description: "User interface design principles and implementation",
              ratings: 4.7,
              sessions: 12,
            }
          ];
          
          setProfile({
            ...user,
            ...parsedProfile,
            skills: mockSkills,
            credits: parsedProfile.credits || 0,
            sessionsCompleted: parsedProfile.sessionsCompleted || 0
          });
        } catch (e) {
          console.error("Error parsing profile:", e);
        }
      } else {
        // If no stored profile, create a default one
        setProfile({
          ...user,
          aboutMe: "No bio available.",
          contactEmail: user.email,
          avatarUrl: "https://github.com/shadcn.png",
          githubUrl: "https://github.com",
          skills: [],
          credits: 0,
          sessionsCompleted: 0
        });
      }
      setLoading(false);
    };

    loadProfile();
  }, [user, navigate]);

  if (loading || !profile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center flex-1">
          <div>Loading profile...</div>
        </div>
      </div>
    );
  }

  const renderSkillCard = (skill: any) => (
    <Card key={skill.id}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{skill.name}</h3>
            <p className="text-gray-500 mt-1">{skill.description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end mb-1">
              <span className="text-amber-500">★</span>
              <span className="font-medium">{skill.ratings}</span>
            </div>
            <Badge variant="outline">{skill.sessions} Sessions</Badge>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm">Edit</Button>
          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">Remove</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container px-4 md:px-6 py-10 flex-1">
        <div className="grid gap-6 md:grid-cols-[1fr_2fr] lg:gap-12">
          {/* Profile Card */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{profile.name}</CardTitle>
                <CardDescription>{profile.contactEmail}</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-skillspark-purple">Sparky</Badge>
                  <Badge variant="outline">{profile.skills.length > 0 ? "5.0 Rating" : "New Sparky"}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">About Me</h3>
                  <p className="text-sm text-gray-500">
                    {profile.aboutMe}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Contact</h3>
                  <p className="text-sm text-gray-500">{profile.contactEmail}</p>
                  {profile.phone && <p className="text-sm text-gray-500">{profile.phone}</p>}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Social Profiles</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => window.open(profile.githubUrl, "_blank")}>
                      <Github className="h-4 w-4" /> GitHub
                    </Button>
                    
                    {profile.portfolioUrl && (
                      <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => window.open(profile.portfolioUrl, "_blank")}>
                        <ExternalLink className="h-4 w-4" /> Portfolio
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-skillspark-softgray rounded-lg">
                      <p className="text-2xl font-bold text-skillspark-purple">{profile.sessionsCompleted}</p>
                      <p className="text-xs text-gray-500">Sessions Completed</p>
                    </div>
                    <div className="text-center p-3 bg-skillspark-softgray rounded-lg">
                      <p className="text-2xl font-bold text-skillspark-purple">{profile.credits}</p>
                      <p className="text-xs text-gray-500">Credits Earned</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Skills Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Skills</h2>
              <Button 
                onClick={() => navigate('/sparkies/add-skill')}
                className="bg-skillspark-purple hover:bg-skillspark-darkpurple"
              >
                Add New Skill
              </Button>
            </div>
            
            {/* Skills Cards */}
            {profile.skills.length > 0 ? (
              profile.skills.map((skill) => renderSkillCard(skill))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">You haven't added any skills yet.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Add your first skill to start getting hired by clients.
                  </p>
                  <Button 
                    onClick={() => navigate('/sparkies/add-skill')}
                    className="mt-4 bg-skillspark-purple hover:bg-skillspark-darkpurple"
                  >
                    Add Your First Skill
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Upcoming Sessions */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Upcoming Sessions</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8 text-gray-500">
                    <p>No upcoming sessions scheduled.</p>
                    <p className="mt-2 text-sm">Your booked sessions will appear here.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SparkyProfilePage;
