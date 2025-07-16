
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"sparky" | "client">("sparky");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { login, isAuthenticated, userType: currentUserType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is already authenticated, redirect to the appropriate dashboard
    if (isAuthenticated) {
      const redirectTo = currentUserType === "sparky" ? "/sparkies/profile" : "/clients/profile";
      
      // Only redirect if we're not already on the target page (prevents redirect loops)
      if (location.pathname !== redirectTo) {
        navigate(redirectTo);
      }
    }
  }, [isAuthenticated, currentUserType, navigate, location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!email || !password) {
      toast({ 
        title: "Error", 
        description: "Email and password are required", 
        variant: "destructive" 
      });
      setIsSubmitting(false);
      return;
    }

    // Log in the user
    try {
      login(email, password, userType);
      toast({ 
        title: "Success", 
        description: "Login successful! Redirecting to dashboard..." 
      });
      
      // Redirection handled by useEffect
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Login failed. Please check your credentials.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="container max-w-md">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome back to SkillSpark</CardTitle>
              <CardDescription className="text-center">
                Login to your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Login as</Label>
                  <RadioGroup 
                    className="flex gap-4" 
                    value={userType} 
                    onValueChange={(value) => setUserType(value as "sparky" | "client")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sparky" id="sparky-login" />
                      <Label htmlFor="sparky-login">Sparky</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="client" id="client-login" />
                      <Label htmlFor="client-login">Client</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-skillspark-purple hover:bg-skillspark-darkpurple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-skillspark-purple hover:underline">
                    Register here
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Login;
