import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useCredits } from "@/context/CreditsContext";
import { useAuth } from "@/context/AuthContext";
import { useSessions } from "@/context/SessionsContext";
import Navbar from "@/components/Navbar";
import {
  Coins, Zap, Star, TrendingUp, CheckCircle, Loader2,
  CreditCard, History, ArrowUpRight, ArrowDownLeft, Gift,
} from "lucide-react";

const creditPackages = [
  { amount: 50, label: "Starter Pack", bonus: 0, price: "$4.99", popular: false, color: "from-slate-500 to-gray-600" },
  { amount: 150, label: "Popular Pack", bonus: 10, price: "$12.99", popular: true, color: "from-purple-500 to-violet-600" },
  { amount: 300, label: "Pro Pack", bonus: 30, price: "$24.99", popular: false, color: "from-blue-500 to-indigo-600" },
  { amount: 600, label: "Power Pack", bonus: 100, price: "$44.99", popular: false, color: "from-emerald-500 to-teal-600" },
];

const Payments: React.FC = () => {
  const { credits, addCredits } = useCredits();
  const { user } = useAuth();
  const { sessions } = useSessions();
  const { toast } = useToast();
  const [buyingPkg, setBuyingPkg] = useState<number | null>(null);

  const handleBuyCredits = async (pkg: typeof creditPackages[0]) => {
    setBuyingPkg(pkg.amount);
    try {
      await addCredits(pkg.amount + pkg.bonus);
    } finally {
      setBuyingPkg(null);
    }
  };

  // Compute transaction history from sessions
  const transactions = sessions
    .filter((s) => s.clientId === user?.id || s.clientId === user?._id)
    .sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime())
    .slice(0, 10);

  const totalSpent = sessions
    .filter((s) => (s.clientId === user?.id || s.clientId === user?._id) && s.status === "completed")
    .reduce((acc, s) => acc + (s.credits || 0), 0);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              <CreditCard className="w-7 h-7 text-primary" /> Credits & Payments
            </h1>
            <p className="text-muted-foreground mt-1">Buy credits to book sessions and post projects</p>
          </div>

          {/* Balance card */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="md:col-span-2 border-primary/20 bg-gradient-to-br from-primary/10 to-violet-500/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/10 -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Available Balance</span>
                </div>
                <p className="text-5xl font-extrabold mb-1">{credits}</p>
                <p className="text-muted-foreground text-sm">credits</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ArrowDownLeft className="w-4 h-4 text-emerald-500" /> {totalSpent} spent
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-blue-500" /> {sessions.filter(s => s.status === "completed").length} sessions
                  </span>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-3">
              <Card className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Star className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sessions Booked</p>
                    <p className="text-lg font-bold">{sessions.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Credits Used</p>
                    <p className="text-lg font-bold">{totalSpent}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Buy credits */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-primary" /> Buy Credits
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {creditPackages.map((pkg) => (
                <Card
                  key={pkg.amount}
                  className={`relative overflow-hidden hover-lift transition-all duration-300 cursor-pointer ${pkg.popular ? "border-primary ring-2 ring-primary/20" : "border-border/50 hover:border-primary/30"}`}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 left-0 right-0 text-center py-1 text-[10px] font-bold text-white animated-gradient">
                      MOST POPULAR
                    </div>
                  )}
                  <CardContent className={`p-4 ${pkg.popular ? "pt-7" : "pt-4"}`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-3`}>
                      <Coins className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-bold text-sm">{pkg.label}</p>
                    <p className="text-2xl font-extrabold mt-1">
                      {pkg.amount}
                      {pkg.bonus > 0 && (
                        <span className="text-sm font-medium text-emerald-500 ml-1">+{pkg.bonus}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">credits</p>
                    {pkg.bonus > 0 && (
                      <div className="flex items-center gap-1 mb-3 text-xs text-emerald-600">
                        <Gift className="w-3 h-3" /> {pkg.bonus} bonus credits!
                      </div>
                    )}
                    <p className="text-sm font-bold mb-3">{pkg.price}</p>
                    <Button
                      size="sm"
                      className={`w-full rounded-xl text-xs h-8 ${pkg.popular ? "animated-gradient text-white" : ""}`}
                      variant={pkg.popular ? "default" : "outline"}
                      onClick={() => handleBuyCredits(pkg)}
                      disabled={!!buyingPkg}
                    >
                      {buyingPkg === pkg.amount ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        "Buy Now"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              💡 For demo purposes, clicking Buy Now adds credits instantly without real payment processing.
            </p>
          </div>

          {/* Transaction history */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> Recent Transactions
            </h2>
            {transactions.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <History className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-semibold">No transactions yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Book a session to see your transaction history</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50">
                <CardContent className="p-0">
                  {transactions.map((session, i) => (
                    <div key={session.id || session._id} className={`flex items-center justify-between p-4 ${i < transactions.length - 1 ? "border-b" : ""}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
                          <ArrowDownLeft className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{session.title || `Session with ${session.sparkyName}`}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(session.createdAt || "").toLocaleDateString()} · with {session.sparkyName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-destructive">−{session.credits} cr</p>
                        <Badge variant="outline" className={`text-xs mt-0.5 ${session.status === "completed" ? "border-emerald-500/20 text-emerald-600" : session.status === "cancelled" ? "text-muted-foreground" : "border-amber-500/20 text-amber-600"}`}>
                          {session.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payments;
