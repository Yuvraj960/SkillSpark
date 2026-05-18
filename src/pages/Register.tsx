import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Eye, EyeOff, Mail, Lock, User, Zap, ArrowRight,
  Sparkles, CheckCircle, BookOpen, DollarSign,
} from "lucide-react";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"sparky" | "client">("client");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast({ title: "Missing Fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords don't match.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Weak Password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name, email, password, userType);
      toast({ title: "Account created! 🎉", description: "Welcome to SkillSpark!" });
      // Redirect after registration
      if (userType === "sparky") {
        navigate("/sparkies/onboarding");
      } else {
        navigate("/clients/profile");
      }
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Registration failed. Please try again.";
      toast({ title: "Registration Failed", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── Left panel ──────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-violet-500/15 blur-3xl animate-float-slow" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl animated-gradient flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl text-white">SkillSpark</span>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-purple-200 text-sm font-medium">Free to join. Always.</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Start your<br />
            <span className="gradient-text">skill journey today</span>
          </h2>

          {/* Role benefits */}
          <div className="space-y-4">
            <div className={`glass rounded-xl p-4 cursor-pointer transition-all duration-200 border ${userType === "client" ? "border-purple-400/50 bg-purple-500/10" : "border-transparent"}`} onClick={() => setUserType("client")}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">As a Client</p>
                  <p className="text-gray-400 text-xs">Book Sparkies, post projects, get mentored</p>
                </div>
                {userType === "client" && <CheckCircle className="ml-auto w-4 h-4 text-purple-400" />}
              </div>
            </div>
            <div className={`glass rounded-xl p-4 cursor-pointer transition-all duration-200 border ${userType === "sparky" ? "border-purple-400/50 bg-purple-500/10" : "border-transparent"}`} onClick={() => setUserType("sparky")}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">As a Sparky</p>
                  <p className="text-gray-400 text-xs">Teach skills, bid on projects, earn credits</p>
                </div>
                {userType === "sparky" && <CheckCircle className="ml-auto w-4 h-4 text-purple-400" />}
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-gray-500 text-sm">© 2025 SkillSpark. All rights reserved.</p>
      </div>

      {/* ─── Right panel (form) ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background overflow-y-auto">
        <div className="w-full max-w-md animate-fade-up py-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-xl">SkillSpark</span>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-extrabold mb-2">Create account</h1>
            <p className="text-muted-foreground">Already have one?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </p>
          </div>

          {/* Mobile role selector */}
          <div className="flex gap-2 p-1 bg-muted rounded-xl mb-6 lg:hidden">
            {(["client", "sparky"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setUserType(type)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${userType === type ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"}`}
              >
                {type === "client" ? "🎓 Client" : "⚡ Sparky"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-medium">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-9 h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors ${confirmPassword && confirmPassword !== password ? "border-destructive" : ""}`}
                />
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-xs text-destructive">Passwords don't match</p>
              )}
            </div>

            {/* Role selector (desktop) */}
            <div className="hidden lg:block">
              <Label className="font-medium mb-2 block">I want to join as</Label>
              <div className="grid grid-cols-2 gap-3">
                {(["client", "sparky"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setUserType(type)}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${userType === type ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                  >
                    <p className="font-semibold text-sm capitalize">{type === "client" ? "🎓 Client" : "⚡ Sparky"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {type === "client" ? "Learn & hire" : "Teach & earn"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl animated-gradient text-white font-bold text-base shadow-lg shadow-purple-900/30 hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:scale-100 mt-2"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Create Free Account <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link to="#" className="text-primary hover:underline">Terms</Link> and{" "}
              <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
