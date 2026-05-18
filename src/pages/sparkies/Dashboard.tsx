import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { userAPI } from "@/lib/api";
import {
  Zap, Star, DollarSign, BookOpen, Plus, Briefcase,
  Calendar, TrendingUp, Clock, ChevronRight, Award, ArrowUpRight,
  Sparkles, Heart,
} from "lucide-react";

interface DashboardData {
  credits: number;
  totalEarnings: number;
  sessionsCompleted: number;
  overallRating: number;
  totalReviews: number;
  skillsCount: number;
  upcomingSessions: {
    _id: string;
    title: string;
    sparkyName?: string;
    clientId?: string;
    scheduledAt: string;
    credits: number;
    skillName?: string;
  }[];
  activeBidsCount: number;
}

const quickActions = [
  { label: "Add New Skill", icon: Plus, href: "/sparkies/add-skill", color: "from-purple-500 to-violet-600", desc: "Expand your offerings" },
  { label: "Browse Projects", icon: Briefcase, href: "/clients/open-projects", color: "from-blue-500 to-indigo-600", desc: "Find work opportunities" },
  { label: "Fund Raise", icon: Heart, href: "/sparkies/fund-raise", color: "from-pink-500 to-rose-600", desc: "Launch a campaign" },
  { label: "View Profile", icon: Star, href: "/sparkies/profile", color: "from-amber-500 to-orange-600", desc: "Manage your page" },
];

const SparklyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await userAPI.getSparkyDashboard();
        setDashboard(res.data.dashboard);
      } catch {
        // Use user data as fallback
        if (user) {
          setDashboard({
            credits: user.credits || 50,
            totalEarnings: user.totalEarnings || 0,
            sessionsCompleted: user.sessionsCompleted || 0,
            overallRating: user.overallRating || 0,
            totalReviews: user.totalReviews || 0,
            skillsCount: user.skills?.length || 0,
            upcomingSessions: [],
            activeBidsCount: 0,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  // Profile completion
  const profileFields = [
    user?.name, user?.aboutMe, user?.contactEmail, user?.githubUrl || user?.portfolioUrl,
    user?.skills && user.skills.length > 0,
    user?.isOnboarded,
  ];
  const completionPercent = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  const stats = dashboard ? [
    { label: "Credits Balance", value: dashboard.credits, icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10", suffix: "" },
    { label: "Total Earnings", value: dashboard.totalEarnings, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10", suffix: " cr" },
    { label: "Sessions Done", value: dashboard.sessionsCompleted, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10", suffix: "" },
    { label: "Avg Rating", value: dashboard.overallRating ? dashboard.overallRating.toFixed(1) : "—", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", suffix: dashboard.overallRating ? ` (${dashboard.totalReviews})` : "" },
  ] : [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">

          {/* ─── Header ─────────────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 ring-4 ring-primary/20">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "SP"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-background" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
                  {(dashboard?.overallRating ?? 0) >= 4.8 && (
                    <Badge className="gap-1 bg-amber-500/10 text-amber-600 border-amber-500/20">
                      <Award className="w-3 h-3" /> Top Rated
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-0.5">
                  {user?.isOnboarded
                    ? `${dashboard?.skillsCount || 0} skills listed · ${dashboard?.activeBidsCount || 0} active bids`
                    : "Complete your onboarding to start earning"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/sparkies/add-skill">
                <Button className="gap-2 animated-gradient text-white shadow-md">
                  <Plus className="w-4 h-4" /> Add Skill
                </Button>
              </Link>
              <Link to="/sparkies/profile">
                <Button variant="outline" className="gap-2">
                  <Star className="w-4 h-4" /> My Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* ─── Profile Completion ──────────────────────────────────── */}
          {completionPercent < 100 && (
            <Card className="mb-6 border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">Complete Your Profile</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{completionPercent}%</span>
                </div>
                <Progress value={completionPercent} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">
                  A complete profile gets 3x more bookings.{" "}
                  <Link to="/sparkies/profile" className="text-primary hover:underline font-medium">Finish now →</Link>
                </p>
              </CardContent>
            </Card>
          )}

          {/* ─── Stats ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value, icon: Icon, color, bg, suffix }) => (
              <Card key={label} className="hover-lift border-border/50">
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <p className="text-2xl font-extrabold">
                    {value}{suffix}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* ─── Quick Actions ──────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map(({ label, icon: Icon, href, color, desc }) => (
                  <Link key={label} to={href}>
                    <div className="group border bg-card rounded-2xl p-4 hover-lift hover:border-primary/30 transition-all cursor-pointer">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Earnings trend */}
              <Card className="mt-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">Earnings This Month</span>
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {dashboard?.totalEarnings || 0} <span className="text-base font-medium">credits</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">From {dashboard?.sessionsCompleted || 0} sessions</p>
                </CardContent>
              </Card>
            </div>

            {/* ─── Upcoming Sessions ──────────────────────────────────── */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" /> Upcoming Sessions
                </h2>
              </div>

              {dashboard?.upcomingSessions && dashboard.upcomingSessions.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.upcomingSessions.map((session) => (
                    <Card key={session._id} className="hover-lift border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{session.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {new Date(session.scheduledAt).toLocaleDateString("en-US", {
                                    weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs border-primary/20 text-primary">
                              {session.credits} cr
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">Upcoming</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-10 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                      <Calendar className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <p className="font-semibold mb-1">No upcoming sessions</p>
                    <p className="text-sm text-muted-foreground mb-4">Add skills to your profile to start receiving bookings from clients</p>
                    <Link to="/sparkies/add-skill">
                      <Button size="sm" className="gap-2">
                        <Plus className="w-3.5 h-3.5" /> Add Your First Skill
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Skills summary */}
              {user?.skills && user.skills.length > 0 && (
                <Card className="mt-4 border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" /> Your Skills
                      </CardTitle>
                      <Link to="/sparkies/profile">
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                          Manage <ChevronRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {user.skills.slice(0, 6).map((skill) => (
                        <Badge key={skill._id || skill.name} variant="outline" className="gap-1 border-primary/20 bg-primary/5">
                          <Zap className="w-3 h-3 text-primary" />
                          {skill.name}
                          <span className="text-muted-foreground text-xs ml-1">{skill.creditsPerSession}cr</span>
                        </Badge>
                      ))}
                      {user.skills.length > 6 && (
                        <Badge variant="outline" className="text-muted-foreground">
                          +{user.skills.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SparklyDashboard;
