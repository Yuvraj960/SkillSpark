import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useCredits } from "@/context/CreditsContext";
import { mentorAPI } from "@/lib/api";
import type { Mentor } from "@/types";
import Navbar from "@/components/Navbar";
import {
  Search, Star, Clock, Coins, MessageSquare, CheckCircle,
  Loader2, Filter, Briefcase, Brain,
} from "lucide-react";

const ConsultMentor: React.FC = () => {
  const { credits, updateCredits } = useCredits();
  const { toast } = useToast();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [message, setMessage] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const fetchMentors = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      const res = await mentorAPI.getMentors(params);
      setMentors(res.data.mentors || []);
    } catch {
      setMentors([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMentors(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMentors();
  };

  const handleRequest = async () => {
    if (!message.trim() || message.length < 20) {
      toast({ title: "Message Too Short", description: "Please write at least 20 characters describing your needs.", variant: "destructive" });
      return;
    }
    if (!selectedMentor) return;

    if (credits < selectedMentor.creditsPerSession) {
      toast({ title: "Insufficient Credits", description: `You need ${selectedMentor.creditsPerSession} credits.`, variant: "destructive" });
      return;
    }

    setIsRequesting(true);
    try {
      const id = selectedMentor._id || selectedMentor.id || "";
      await mentorAPI.requestConsultation(id, message);
      updateCredits(credits - selectedMentor.creditsPerSession);
      setRequestSuccess(true);
      setMessage("");
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to send request.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold flex items-center gap-2">
                <Brain className="w-7 h-7 text-primary" /> Expert Mentors
              </h1>
              <p className="text-muted-foreground mt-1">Get guidance from industry veterans</p>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2">
              <Coins className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary">{credits} credits</span>
            </div>
          </div>

          {/* Search */}
          <Card className="mb-6 border-border/50">
            <CardContent className="p-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or expertise..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-10 rounded-xl"
                  />
                </div>
                <Button type="submit" variant="outline" className="h-10 rounded-xl gap-1.5">
                  <Filter className="w-3.5 h-3.5" /> Search
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Mentors grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading mentors...</p>
              </div>
            </div>
          ) : mentors.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-semibold">No mentors found</p>
                <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {mentors.map((mentor) => {
                const id = mentor._id || mentor.id || "";
                return (
                  <Card key={id} className="group hover-lift border-border/50 hover:border-primary/30 transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                          <AvatarImage src={mentor.avatarUrl} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                            {mentor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold truncate">{mentor.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{mentor.title}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            {mentor.rating && mentor.rating > 0 ? (
                              <>
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-medium">{mentor.rating.toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">· {mentor.totalSessions} sessions</span>
                              </>
                            ) : (
                              <span className="text-xs text-muted-foreground">{mentor.experience}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {mentor.bio && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{mentor.bio}</p>
                      )}

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {mentor.specialties.slice(0, 4).map((s) => (
                          <Badge key={s} variant="outline" className="text-xs border-primary/20 bg-primary/5">{s}</Badge>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Coins className="w-4 h-4 text-primary" />
                            <span className="font-bold text-primary">{mentor.creditsPerSession}</span>
                            <span className="text-muted-foreground text-xs">/ session</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <Clock className="w-3 h-3" /> {mentor.availability}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="animated-gradient text-white rounded-xl"
                          onClick={() => { setSelectedMentor(mentor); setRequestSuccess(false); }}
                        >
                          <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Consult
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Request Dialog */}
      <Dialog open={!!selectedMentor} onOpenChange={(open) => { if (!open) setSelectedMentor(null); }}>
        <DialogContent className="max-w-md">
          {requestSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 animate-scale-in">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <DialogTitle className="text-xl font-bold mb-2">Request Sent! 🎉</DialogTitle>
              <p className="text-muted-foreground text-sm mb-6">
                <strong>{selectedMentor?.name}</strong> will review your request and reach out to schedule your session.
              </p>
              <Button className="w-full animated-gradient text-white" onClick={() => setSelectedMentor(null)}>Done</Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedMentor?.avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {selectedMentor?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  Consult {selectedMentor?.name}
                </DialogTitle>
                <DialogDescription>Describe what you'd like to discuss. Be specific about your goals and challenges.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Your Message *</label>
                  <Textarea
                    placeholder="Tell the mentor about your situation, goals, and what kind of guidance you're looking for..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px] rounded-xl resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{message.length}/20 min characters</p>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl text-sm">
                  <span className="text-muted-foreground">Session cost</span>
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-primary" />
                    <span className="font-bold text-primary">{selectedMentor?.creditsPerSession} credits</span>
                  </div>
                </div>

                {credits < (selectedMentor?.creditsPerSession || 0) && (
                  <p className="text-xs text-destructive">
                    ⚠️ Insufficient credits. You have {credits} but need {selectedMentor?.creditsPerSession}.
                  </p>
                )}

                <Button
                  className="w-full animated-gradient text-white rounded-xl"
                  onClick={handleRequest}
                  disabled={isRequesting || credits < (selectedMentor?.creditsPerSession || 0)}
                >
                  {isRequesting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Send Request
                    </div>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultMentor;
