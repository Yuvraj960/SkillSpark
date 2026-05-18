import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap, Star, Users, BookOpen, TrendingUp, Shield, ArrowRight,
  Code, Palette, BarChart2, Brain, Globe, Music, ChevronRight,
  Play, CheckCircle, Sparkles, Award, Clock,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const stats = [
  { value: "2,400+", label: "Sparkies", icon: Users },
  { value: "15,000+", label: "Sessions Done", icon: Zap },
  { value: "98%", label: "Satisfaction", icon: Star },
  { value: "120+", label: "Skill Categories", icon: BookOpen },
];

const features = [
  {
    icon: Zap,
    title: "Instant Skill Matching",
    description: "AI-powered matching connects you with the perfect Sparky for your needs in seconds.",
    color: "from-purple-500 to-violet-600",
    light: "bg-purple-500/10",
  },
  {
    icon: Shield,
    title: "Credit-Based Safety",
    description: "Secure credit system means no surprises. Pay only for sessions you're satisfied with.",
    color: "from-blue-500 to-indigo-600",
    light: "bg-blue-500/10",
  },
  {
    icon: TrendingUp,
    title: "Track Your Growth",
    description: "Visual dashboards show your skill progress, session history, and earnings at a glance.",
    color: "from-emerald-500 to-teal-600",
    light: "bg-emerald-500/10",
  },
  {
    icon: Brain,
    title: "AI Learning Paths",
    description: "Get a personalized roadmap from our Gemini AI based on your goals and current skills.",
    color: "from-pink-500 to-rose-600",
    light: "bg-pink-500/10",
  },
  {
    icon: Globe,
    title: "100% Remote-First",
    description: "All sessions happen online. Learn from top experts worldwide without leaving home.",
    color: "from-amber-500 to-orange-600",
    light: "bg-amber-500/10",
  },
  {
    icon: Award,
    title: "Vet Every Sparky",
    description: "Every Sparky completes onboarding with verified skills, ratings, and portfolio proof.",
    color: "from-cyan-500 to-sky-600",
    light: "bg-cyan-500/10",
  },
];

const howItWorksClient = [
  { step: "01", title: "Create Account", desc: "Sign up as a client in under 2 minutes." },
  { step: "02", title: "Get Credits", desc: "Purchase credits to book sessions and fund projects." },
  { step: "03", title: "Find a Sparky", desc: "Browse or let AI match you with the perfect tutor." },
  { step: "04", title: "Book & Learn", desc: "Schedule, attend, and rate your session." },
];

const howItWorksSparky = [
  { step: "01", title: "Register as Sparky", desc: "Create your account and complete onboarding." },
  { step: "02", title: "List Your Skills", desc: "Add skills with pricing and session details." },
  { step: "03", title: "Bid on Projects", desc: "Browse client projects and submit proposals." },
  { step: "04", title: "Earn Credits", desc: "Get paid in credits; cash out or reinvest." },
];

const categories = [
  { icon: Code, label: "Programming", count: "480+" },
  { icon: Palette, label: "Design", count: "210+" },
  { icon: BarChart2, label: "Marketing", count: "160+" },
  { icon: Brain, label: "AI & Data", count: "140+" },
  { icon: Globe, label: "Languages", count: "95+" },
  { icon: Music, label: "Music & Arts", count: "75+" },
];

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Junior Developer → Senior Dev in 6 months",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=b6e3f4",
    text: "SkillSpark connected me with John, a React expert. In 3 months, I went from struggling with hooks to building full production apps. Best investment I've ever made.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Sparky — 40+ sessions completed",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=ffd5dc",
    text: "I started teaching Python on SkillSpark part-time and now earn more from sessions than my day job. The platform handles everything so I can just focus on teaching.",
    rating: 5,
  },
  {
    name: "Marcus Reid",
    role: "Design Lead, TechCorp",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus&backgroundColor=c0aede",
    text: "We used SkillSpark to upskill our entire design team. The quality of Sparkies here is exceptional — these are real industry professionals, not just hobbyists.",
    rating: 5,
  },
];

const TypewriterText = ({ texts }: { texts: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[currentIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.slice(0, displayText.length + 1));
        if (displayText === current) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(current.slice(0, displayText.length - 1));
        if (displayText === "") {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts]);

  return (
    <span className="gradient-text">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"client" | "sparky">("client");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 dot-grid opacity-40" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-500/15 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl animate-float-slow" style={{ animationDelay: '4s' }} />

        {/* Decorative ring */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-purple-500/20 animate-spin-slow" />
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full border border-violet-500/15 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />

        <div className="relative container mx-auto px-4 md:px-6 py-20 z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="animate-fade-up mb-6">
              <Badge className="glass border-purple-500/30 text-purple-300 px-4 py-1.5 text-sm font-medium gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Skill Marketplace
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight" style={{ animationDelay: '0.1s' }}>
              Master Any Skill with{" "}
              <br />
              <TypewriterText texts={["Expert Sparkies", "Real Mentors", "Live Sessions", "AI Guidance"]} />
            </h1>

            <p className="animate-fade-up text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ animationDelay: '0.2s' }}>
              SkillSpark connects passionate learners with talented experts. Book 1-on-1 sessions, collaborate on real projects, and grow faster than ever—powered by AI.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-up flex flex-col sm:flex-row gap-4 justify-center mb-12" style={{ animationDelay: '0.3s' }}>
              <Link to="/register">
                <Button size="lg" className="animated-gradient text-white font-semibold px-8 py-6 text-lg rounded-xl glow-purple-sm hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-900/40">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="glass border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl font-semibold">
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="animate-fade-up grid grid-cols-2 md:grid-cols-4 gap-4" style={{ animationDelay: '0.4s' }}>
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="glass rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-purple-400" />
                    <span className="text-2xl font-bold text-white">{value}</span>
                  </div>
                  <p className="text-sm text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ──────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">All Skill Areas</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Every Category</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From coding to creative arts — find a Sparky expert in any domain.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(({ icon: Icon, label, count }) => (
              <Link key={label} to="/register">
                <div className="group border bg-card rounded-2xl p-5 text-center hover-lift cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{count} skills</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">Why SkillSpark</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need to Grow</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete platform for learning, teaching, and collaborating—all powered by AI.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description, color, light }) => (
              <div key={title} className="group border bg-card rounded-2xl p-6 hover-lift hover:border-primary/30 transition-all duration-300 card-shine">
                <div className={`w-12 h-12 rounded-xl ${light} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How SkillSpark Works</h2>
          </div>

          {/* Tab switcher */}
          <div className="flex justify-center mb-12">
            <div className="flex gap-2 p-1.5 bg-muted rounded-xl">
              <button
                onClick={() => setActiveTab("client")}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${activeTab === "client" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
              >
                For Clients
              </button>
              <button
                onClick={() => setActiveTab("sparky")}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${activeTab === "sparky" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
              >
                For Sparkies
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {(activeTab === "client" ? howItWorksClient : howItWorksSparky).map((item, i) => (
              <div key={item.step} className="relative text-center animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-3/4 w-1/2 h-0.5 bg-gradient-to-r from-primary/40 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-black gradient-text">{item.step}</span>
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">Success Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Thousands</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="border bg-card rounded-2xl p-6 hover-lift hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-3xl" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full ring-2 ring-primary/20" />
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-10" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mb-6 animate-bounce-subtle">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to <span className="gradient-text">Ignite</span> Your Potential?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join 2,400+ Sparkies and 15,000+ learners already growing on SkillSpark. Start free today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="animated-gradient text-white font-bold px-10 py-6 text-lg rounded-xl glow-purple-sm hover:scale-105 transition-transform shadow-lg shadow-purple-900/30">
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="px-10 py-6 text-lg rounded-xl font-semibold border-primary/30 hover:bg-primary/10">
                  Become a Sparky
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              {["No credit card required", "Free 100 credits on signup", "Cancel anytime"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="border-t bg-muted/20 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg">SkillSpark</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">AI-powered skill development platform connecting learners with expert Sparkies worldwide.</p>
            </div>
            {[
              { title: "Platform", links: ["For Clients", "For Sparkies", "Pricing", "Resources"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link to="/register" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t text-sm text-muted-foreground">
            <p>© 2025 SkillSpark. All rights reserved.</p>
            <div className="flex items-center gap-1 mt-2 md:mt-0">
              <Clock className="w-3.5 h-3.5" />
              <span>Built with ❤️ for learners worldwide</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
