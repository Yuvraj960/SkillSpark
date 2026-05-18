import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Mail, Lock, Zap, ArrowRight, Sparkles } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing Fields", description: "Please enter your email and password.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast({ title: "Welcome back! 🎉", description: "Login successful. Redirecting..." });
      // AuthContext will handle redirect via ProtectedRoute / PublicOnlyRoute
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Invalid email or password.";
      toast({ title: "Login Failed", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── Left panel (branding) ───────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-violet-500/15 blur-3xl animate-float-slow" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl animated-gradient flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl text-white">SkillSpark</span>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-purple-200 text-sm font-medium">AI-Powered Learning</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Welcome back to your<br />
            <span className="gradient-text">growth journey</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            2,400+ Sparkies. 15,000+ sessions. One platform designed to accelerate your skills.
          </p>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-4">
            {[["2,400+", "Sparkies"], ["15K+", "Sessions"], ["98%", "Satisfaction"]].map(([val, label]) => (
              <div key={label} className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{val}</p>
                <p className="text-xs text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-gray-500 text-sm">© 2025 SkillSpark. All rights reserved.</p>
      </div>

      {/* ─── Right panel (form) ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-xl">SkillSpark</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold mb-2">Sign in</h1>
            <p className="text-muted-foreground">Don't have an account?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">Create one free</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-medium">Password</Label>
                <Link to="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl animated-gradient text-white font-bold text-base shadow-lg shadow-purple-900/30 hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-muted/40 rounded-xl border border-border/50">
            <p className="text-xs font-semibold text-muted-foreground mb-2">🧪 Demo Credentials (after seeding):</p>
            <div className="space-y-1 text-xs text-muted-foreground font-mono">
              <p>Sparky: john.smith@skillspark.com</p>
              <p>Client: alex.thompson@example.com</p>
              <p>Password: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
