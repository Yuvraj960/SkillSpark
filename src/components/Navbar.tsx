import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useCredits } from "@/context/CreditsContext";
import { useTheme } from "@/context/ThemeContext";
import {
  Zap, Moon, Sun, Menu, LogOut, User, ChevronDown,
  LayoutDashboard, Plus, DollarSign, Briefcase, BookOpen,
  Users, Heart, CreditCard, MessageSquare, X, Coins,
} from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sparkyLinks: NavLink[] = [
  { href: "/sparkies/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sparkies/profile", label: "My Profile", icon: User },
  { href: "/sparkies/add-skill", label: "Add Skill", icon: Plus },
  { href: "/clients/open-projects", label: "Projects", icon: Briefcase },
  { href: "/sparkies/fund-raise", label: "Fund Raise", icon: Heart },
];

const clientLinks: NavLink[] = [
  { href: "/clients/profile", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients/book-sparky", label: "Book Sparky", icon: Users },
  { href: "/clients/open-projects", label: "Projects", icon: Briefcase },
  { href: "/clients/consult-mentor", label: "Mentors", icon: MessageSquare },
  { href: "/clients/resources", label: "Resources", icon: BookOpen },
  { href: "/clients/fund-raise", label: "Fund Raise", icon: Heart },
  { href: "/clients/payments", label: "Credits", icon: CreditCard },
];

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { credits } = useCredits();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = user?.type === "sparky" ? sparkyLinks : clientLinks;
  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "navbar-blur shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to={isAuthenticated ? (user?.type === "sparky" ? "/sparkies/dashboard" : "/clients/profile") : "/"} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              Skill<span className="gradient-text">Spark</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-1">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 rounded-lg"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {isAuthenticated ? (
              <>
                {/* Credits badge */}
                <Link to="/clients/payments" className="hidden md:flex">
                  <Badge variant="outline" className="gap-1.5 px-3 py-1 border-primary/30 bg-primary/5 text-primary font-semibold cursor-pointer hover:bg-primary/10 transition-colors">
                    <Coins className="w-3.5 h-3.5" />
                    {credits} credits
                  </Badge>
                </Link>

                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden md:flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-muted">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user?.avatarUrl} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium max-w-[100px] truncate">{user?.name}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <div className="px-3 py-2">
                      <p className="font-semibold text-sm truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      <Badge variant="outline" className="mt-1 text-xs capitalize px-1.5 py-0.5 border-primary/30 text-primary">
                        {user?.type}
                      </Badge>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={user?.type === "sparky" ? "/sparkies/profile" : "/clients/profile"} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    {user?.type === "client" && (
                      <DropdownMenuItem asChild>
                        <Link to="/clients/payments" className="cursor-pointer">
                          <DollarSign className="mr-2 h-4 w-4" /> Buy Credits
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile hamburger */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8">
                      {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72 p-0">
                    <div className="flex flex-col h-full">
                      {/* Header */}
                      <div className="p-5 border-b bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.avatarUrl} />
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                              {userInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{user?.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Badge variant="outline" className="text-xs capitalize border-primary/30 text-primary">
                                {user?.type}
                              </Badge>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Coins className="w-3 h-3" /> {credits}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Links */}
                      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {links.map(({ href, label, icon: Icon }) => (
                          <Link
                            key={href}
                            to={href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                              isActive(href)
                                ? "bg-primary/10 text-primary"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {label}
                          </Link>
                        ))}
                      </nav>

                      {/* Footer */}
                      <div className="p-4 border-t">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-medium">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="animated-gradient text-white font-semibold rounded-lg shadow-md shadow-purple-900/20">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
