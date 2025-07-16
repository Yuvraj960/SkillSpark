
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, Shield, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCredits } from "@/context/CreditsContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const creditPackages = [
  {
    id: "basic",
    name: "Basic Pack",
    credits: 50,
    price: 9.99,
    popular: false,
    description: "Perfect for occasional learning sessions"
  },
  {
    id: "standard",
    name: "Standard Pack",
    credits: 150,
    price: 24.99,
    popular: true,
    description: "Great value for regular learners"
  },
  {
    id: "premium",
    name: "Premium Pack",
    credits: 300,
    price: 44.99,
    popular: false,
    description: "Best for intensive skill development"
  },
  {
    id: "enterprise",
    name: "Enterprise Pack",
    credits: 500,
    price: 69.99,
    popular: false,
    description: "Maximum credits for power users"
  }
];

const Payments: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { credits, addCredits } = useCredits();
  const { toast } = useToast();
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handlePurchase = async (packageId: string, creditsAmount: number, price: number) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      addCredits(creditsAmount);
      setIsProcessing(false);
      toast({
        title: "Payment Successful!",
        description: `${creditsAmount} credits have been added to your account.`,
      });
    }, 2000);
  };

  const handleCustomPurchase = () => {
    const amount = parseInt(customAmount);
    if (amount < 10) {
      toast({
        title: "Minimum Amount Required",
        description: "Minimum purchase is 10 credits ($1.99)",
        variant: "destructive"
      });
      return;
    }
    
    const price = (amount * 0.199).toFixed(2);
    handlePurchase("custom", amount, parseFloat(price));
    setCustomAmount("");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Add Credits</h1>
              <p className="text-muted-foreground">Purchase credits to book sessions and support projects</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold text-primary">{credits} credits</p>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">SSL encrypted transactions</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Instant Delivery</h3>
                <p className="text-sm text-muted-foreground">Credits added immediately</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Wallet className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Best Value</h3>
                <p className="text-sm text-muted-foreground">More credits = better savings</p>
              </CardContent>
            </Card>
          </div>

          {/* Credit Packages */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {creditPackages.map((pkg) => (
              <Card key={pkg.id} className={`relative ${pkg.popular ? 'ring-2 ring-primary' : ''}`}>
                {pkg.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">{pkg.credits}</p>
                    <p className="text-sm text-muted-foreground">credits</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${pkg.price}</p>
                    <p className="text-sm text-muted-foreground">
                      ${(pkg.price / pkg.credits).toFixed(3)} per credit
                    </p>
                  </div>
                  <Button 
                    onClick={() => handlePurchase(pkg.id, pkg.credits, pkg.price)}
                    disabled={isProcessing}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isProcessing ? "Processing..." : "Purchase"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Custom Amount */}
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <CreditCard className="h-5 w-5" />
                Custom Amount
              </CardTitle>
              <CardDescription>
                Purchase any amount of credits (minimum 10)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter credits amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min="10"
                />
                <Button 
                  onClick={handleCustomPurchase}
                  disabled={!customAmount || parseInt(customAmount) < 10 || isProcessing}
                  className="bg-primary hover:bg-primary/90"
                >
                  Buy
                </Button>
              </div>
              {customAmount && parseInt(customAmount) >= 10 && (
                <p className="text-center text-sm text-muted-foreground">
                  Total: ${(parseInt(customAmount) * 0.199).toFixed(2)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold mb-4">Accepted Payment Methods</h3>
            <div className="flex justify-center items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span className="text-sm">Credit Cards</span>
              </div>
              <span>•</span>
              <span className="text-sm">PayPal</span>
              <span>•</span>
              <span className="text-sm">Bank Transfer</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payments;
