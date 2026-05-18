import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useCredits } from "@/context/CreditsContext";
import { useSessions } from "@/context/SessionsContext";
import { userAPI } from "@/lib/api";
import type { SparkyProfile } from "@/types";
import Navbar from "@/components/Navbar";
import {
  Search, Star, Clock, Coins, Zap, Globe, Users,
  Calendar, CheckCircle, Filter, Loader2,
} from "lucide-react";

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "07:00 PM",
];

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "programming", label: "💻 Programming" },
  { value: "design", label: "🎨 Design" },
  { value: "marketing", label: "📈 Marketing" },
  { value: "business", label: "💼 Business" },
  { value: "personal", label: "🧠 Personal Development" },
  { value: "music", label: "🎵 Music & Arts" },
  { value: "language", label: "🌍 Languages" },
];

const BookSparky: React.FC = () => {
  const { user } = useAuth();
  const { credits, updateCredits } = useCredits();
  const { bookSession } = useSessions();
  const { toast } = useToast();

  const [sparkies, setSparkies] = useState<SparkyProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedSparky, setSelectedSparky] = useState<SparkyProfile | null>(null);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const fetchSparkies = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (category !== "all") params.category = category;
      const res = await userAPI.getSparkies(params);
      setSparkies(res.data.sparkies || []);
    } catch {
      setSparkies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSparkies(); }, [category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSparkies();
  };

  const openBookingModal = (sparky: SparkyProfile) => {
    setSelectedSparky(sparky);
    setSelectedSkillIndex(0);
    setSelectedDate("");
    setSelectedTime("");
    setBookingSuccess(false);
  };

  const handleBook = async () => {
    if (!selectedSparky || !selectedDate || !selectedTime) {
      toast({ title: "Missing Info", description: "Please select a date and time slot.", variant: "destructive" });
      return;
    }
    const skill = selectedSparky.skills[selectedSkillIndex];
    if (!skill) return;

    if (credits < skill.creditsPerSession) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${skill.creditsPerSession} credits but have ${credits}. Buy more credits to continue.`,
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      // Parse date + time into ISO
      const [hourStr, period] = selectedTime.split(" ");
      let [hours, minutes] = hourStr.split(":").map(Number);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(hours, minutes, 0, 0);

      const success = await bookSession(
        selectedSparky.id || selectedSparky._id || "",
        selectedSparky.name,
        skill.name,
        scheduledAt,
        skill.creditsPerSession,
        skill.sessionLength
      );

      if (success) {
        // Update local credit display
        updateCredits(credits - skill.creditsPerSession);
        setBookingSuccess(true);
      }
    } finally {
      setIsBooking(false);
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
                <Zap className="w-7 h-7 text-primary" /> Book a Sparky
              </h1>
              <p className="text-muted-foreground mt-1">Find and book expert 1-on-1 sessions</p>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2">
              <Coins className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary">{credits} credits available</span>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6 border-border/50">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or skill..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-10 rounded-xl"
                    />
                  </div>
                  <Button type="submit" variant="outline" className="h-10 rounded-xl gap-1.5">
                    <Filter className="w-3.5 h-3.5" /> Search
                  </Button>
                </form>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-10 w-48 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Sparkies Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Finding Sparkies...</p>
              </div>
            </div>
          ) : sparkies.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-semibold">No Sparkies found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or category</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {sparkies.map((sparky) => {
                const id = sparky.id || sparky._id || "";
                return (
                  <Card key={id} className="group hover-lift border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                          <AvatarImage src={sparky.avatarUrl} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                            {sparky.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold truncate">{sparky.name}</h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {sparky.overallRating > 0 ? (
                              <>
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-medium">{sparky.overallRating.toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">({sparky.totalReviews} reviews)</span>
                              </>
                            ) : (
                              <span className="text-xs text-muted-foreground">New Sparky</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" /> Remote
                            </span>
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3" /> {sparky.sessionsCompleted} sessions
                            </span>
                          </div>
                        </div>
                      </div>

                      {sparky.aboutMe && (
                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{sparky.aboutMe}</p>
                      )}

                      {/* Skills */}
                      <div className="space-y-2 mb-4">
                        {sparky.skills.slice(0, 3).map((skill) => (
                          <div key={skill._id || skill.name} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <span className="text-xs font-medium truncate">{skill.name}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                                <Clock className="w-3 h-3" /> {skill.sessionLength}m
                              </span>
                              <Badge variant="outline" className="text-xs border-primary/20 text-primary py-0 px-1.5">
                                {skill.creditsPerSession}cr
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => openBookingModal(sparky)}
                        className="w-full animated-gradient text-white font-semibold rounded-xl group-hover:shadow-lg group-hover:shadow-purple-900/20 transition-shadow"
                      >
                        <Calendar className="w-4 h-4 mr-2" /> Book Session
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ─── Booking Modal ───────────────────────────────────────────── */}
      <Dialog open={!!selectedSparky} onOpenChange={(open) => { if (!open) setSelectedSparky(null); }}>
        <DialogContent className="max-w-md">
          {bookingSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 animate-scale-in">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <DialogTitle className="text-xl font-bold mb-2">Booking Confirmed! 🎉</DialogTitle>
              <p className="text-muted-foreground text-sm mb-6">
                Your session with <strong>{selectedSparky?.name}</strong> has been booked. Check your dashboard for details.
              </p>
              <Button className="w-full animated-gradient text-white" onClick={() => setSelectedSparky(null)}>
                Done
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedSparky?.avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {selectedSparky?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  Book {selectedSparky?.name}
                </DialogTitle>
                <DialogDescription>Select a skill, date, and time for your session.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                {/* Skill selector */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Choose Skill</label>
                  <div className="space-y-2">
                    {selectedSparky?.skills.map((skill, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedSkillIndex(i)}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedSkillIndex === i ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                      >
                        <div>
                          <p className="font-semibold text-sm">{skill.name}</p>
                          <p className="text-xs text-muted-foreground">{skill.sessionLength} min session</p>
                        </div>
                        <Badge variant="outline" className="border-primary/30 text-primary font-bold">
                          {skill.creditsPerSession} cr
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Date</label>
                  <Input
                    type="date"
                    min={minDateStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>

                {/* Time slots */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Time Slot</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${selectedTime === slot ? "border-primary bg-primary text-white" : "border-border hover:border-primary/40"}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Credit summary */}
                {selectedSparky && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl text-sm">
                    <span className="text-muted-foreground">Session cost</span>
                    <span className="font-bold text-primary">
                      {selectedSparky.skills[selectedSkillIndex]?.creditsPerSession} credits
                    </span>
                  </div>
                )}

                {credits < (selectedSparky?.skills[selectedSkillIndex]?.creditsPerSession || 0) && (
                  <p className="text-xs text-destructive flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Insufficient credits. You need {selectedSparky?.skills[selectedSkillIndex]?.creditsPerSession} but have {credits}.
                  </p>
                )}

                <Button
                  className="w-full animated-gradient text-white font-semibold rounded-xl"
                  onClick={handleBook}
                  disabled={isBooking || !selectedDate || !selectedTime || credits < (selectedSparky?.skills[selectedSkillIndex]?.creditsPerSession || 0)}
                >
                  {isBooking ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Booking...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Confirm Booking
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

export default BookSparky;
