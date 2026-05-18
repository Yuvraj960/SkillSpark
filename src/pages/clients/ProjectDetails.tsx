import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { projectAPI } from "@/lib/api";
import type { Project } from "@/types";
import Navbar from "@/components/Navbar";
import {
  ArrowLeft, DollarSign, Calendar, Clock, Users, Star,
  CheckCircle, XCircle, Loader2, Send, Briefcase, AlertTriangle,
} from "lucide-react";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [isAcceptingBid, setIsAcceptingBid] = useState<string | null>(null);

  // Bid form state
  const [bidAmount, setBidAmount] = useState("");
  const [bidProposal, setBidProposal] = useState("");
  const [bidDuration, setBidDuration] = useState("");

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await projectAPI.getProject(id);
      setProject(res.data.project);
    } catch {
      toast({ title: "Error", description: "Project not found.", variant: "destructive" });
      navigate("/clients/open-projects");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceBid = async () => {
    if (!bidAmount || !bidProposal || !bidDuration) {
      toast({ title: "Missing Fields", description: "Please fill all bid fields.", variant: "destructive" });
      return;
    }
    if (bidProposal.length < 20) {
      toast({ title: "Proposal Too Short", description: "Write at least 20 characters.", variant: "destructive" });
      return;
    }

    setIsSubmittingBid(true);
    try {
      const res = await projectAPI.placeBid(id!, {
        amount: parseInt(bidAmount),
        proposal: bidProposal,
        estimatedDuration: bidDuration,
      });
      setProject(res.data.project);
      setBidAmount(""); setBidProposal(""); setBidDuration("");
      toast({ title: "Bid Submitted! 🎉", description: "The client will review your proposal." });
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to submit bid.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    setIsAcceptingBid(bidId);
    try {
      const res = await projectAPI.acceptBid(id!, bidId);
      setProject(res.data.project);
      toast({ title: "Bid Accepted! ✅", description: "The Sparky has been assigned to your project." });
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to accept bid.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsAcceptingBid(null);
    }
  };

  const isOwner = project?.clientId === user?.id || project?.clientId === user?._id;
  const isSparky = user?.type === "sparky";
  const userBid = project?.bids.find(
    (b) => b.sparkyId === user?.id || b.sparkyId === user?._id
  );
  const hasActiveBid = !!userBid;

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      open: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      assigned: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      "in-progress": "bg-amber-500/10 text-amber-600 border-amber-500/20",
      completed: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    };
    return map[status] || "";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6 max-w-4xl">
          {/* Back */}
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 mb-6 -ml-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* ─── Main content ─────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Project card */}
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h1 className="text-2xl font-extrabold">{project.title}</h1>
                        <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Posted by {project.clientName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-3xl font-extrabold text-primary">{project.budget}</p>
                      <p className="text-xs text-muted-foreground">credits budget</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-5">{project.description}</p>

                  {project.requirements.length > 0 && (
                    <div className="mb-5">
                      <p className="text-sm font-semibold mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {project.requirements.map((req) => (
                          <Badge key={req} variant="outline" className="border-primary/20 bg-primary/5">{req}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-5 text-sm text-muted-foreground pt-4 border-t">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Deadline: {new Date(project.deadline).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {project.bids.length} bid{project.bids.length !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      Posted {new Date(project.createdAt || "").toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Bids list — visible to project owner OR to sparkies (to see their own bid) */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    {isOwner ? `All Bids (${project.bids.length})` : isSparky && hasActiveBid ? "Your Bid" : "Bids"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Show all bids to owner, only own bid to sparky */}
                  {(() => {
                    const visibleBids = isOwner
                      ? project.bids
                      : isSparky
                        ? project.bids.filter((b) => b.sparkyId === user?.id || b.sparkyId === user?._id)
                        : [];

                    if (visibleBids.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground text-sm">
                            {isSparky ? "You haven't placed a bid yet." : "No bids received yet."}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {visibleBids.map((bid) => {
                          const bidId = bid._id || bid.id || "";
                          return (
                            <div key={bidId} className={`p-4 rounded-xl border transition-all ${bid.status === "accepted" ? "border-emerald-500/30 bg-emerald-500/5" : bid.status === "rejected" ? "border-muted opacity-60" : "border-border/50 hover:border-primary/20"}`}>
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage src={bid.sparkyAvatar} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                      {bid.sparkyName.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold text-sm">{bid.sparkyName}</p>
                                    {bid.sparkyRating && (
                                      <div className="flex items-center gap-1 mt-0.5">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        <span className="text-xs text-muted-foreground">{bid.sparkyRating.toFixed(1)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-primary">{bid.amount} cr</p>
                                  <p className="text-xs text-muted-foreground">{bid.estimatedDuration}</p>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{bid.proposal}</p>

                              <div className="flex items-center justify-between">
                                <Badge
                                  className={`text-xs ${bid.status === "accepted" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : bid.status === "rejected" ? "bg-red-500/10 text-red-600 border-red-500/20" : "bg-muted text-muted-foreground border-border"}`}
                                >
                                  {bid.status}
                                </Badge>

                                {isOwner && bid.status === "pending" && project.status === "open" && (
                                  <Button
                                    size="sm"
                                    className="h-7 gap-1.5 text-xs rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
                                    onClick={() => handleAcceptBid(bidId)}
                                    disabled={!!isAcceptingBid}
                                  >
                                    {isAcceptingBid === bidId ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <CheckCircle className="w-3 h-3" />
                                    )}
                                    Accept Bid
                                  </Button>
                                )}
                                {bid.status === "accepted" && (
                                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                    <CheckCircle className="w-3.5 h-3.5" /> Accepted
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>

            {/* ─── Sidebar ──────────────────────────────────────────── */}
            <div className="space-y-5">
              {/* Place bid form — Sparkies only, project open, no existing bid */}
              {isSparky && project.status === "open" && !hasActiveBid && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Send className="w-4 h-4 text-primary" /> Submit a Bid
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Your Bid (credits) *</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder={`Max: ${project.budget}`}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          max={project.budget}
                          className="pl-9 h-10 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Estimated Duration *</label>
                      <Input
                        placeholder="e.g. 1 week, 2-3 days"
                        value={bidDuration}
                        onChange={(e) => setBidDuration(e.target.value)}
                        className="h-10 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Your Proposal *</label>
                      <Textarea
                        placeholder="Explain why you're the best fit for this project..."
                        value={bidProposal}
                        onChange={(e) => setBidProposal(e.target.value)}
                        className="min-h-[100px] rounded-xl text-sm resize-none"
                      />
                    </div>
                    <Button
                      className="w-full animated-gradient text-white rounded-xl"
                      onClick={handlePlaceBid}
                      disabled={isSubmittingBid}
                    >
                      {isSubmittingBid ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4" /> Submit Bid
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Already bid notice */}
              {isSparky && hasActiveBid && (
                <Card className="border-emerald-500/20 bg-emerald-500/5">
                  <CardContent className="p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Bid Submitted</p>
                      <p className="text-xs text-muted-foreground">You bid {userBid?.amount} credits</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project closed notice */}
              {isSparky && project.status !== "open" && (
                <Card className="border-amber-500/20 bg-amber-500/5">
                  <CardContent className="p-4 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Project {project.status}</p>
                      <p className="text-xs text-muted-foreground">Not accepting new bids</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project status card */}
              <Card className="border-border/50">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className={`text-xs ${getStatusColor(project.status)}`}>{project.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Budget</span>
                    <span className="font-bold text-primary">{project.budget} credits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Deadline</span>
                    <span className="font-medium text-sm">{new Date(project.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Bids</span>
                    <span className="font-medium text-sm">{project.bids.length}</span>
                  </div>
                  {isOwner && project.status === "open" && (
                    <Button variant="outline" size="sm" className="w-full mt-2 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={async () => {
                      try {
                        await projectAPI.updateProject(id!, { status: "cancelled" });
                        toast({ title: "Project Cancelled" });
                        navigate("/clients/open-projects");
                      } catch { /* ignore */ }
                    }}>
                      <XCircle className="w-3.5 h-3.5 mr-1.5" /> Cancel Project
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Link to="/clients/open-projects">
                <Button variant="ghost" className="w-full gap-2 text-sm">
                  <ArrowLeft className="w-4 h-4" /> All Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
