
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import { 
  UserCircle, 
  PlusCircle, 
  DollarSign, 
  Calendar, 
  BookOpen, 
  GraduationCap,
  FileText,
  LogOut,
  LogIn,
  UserPlus,
  Briefcase
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, userType, isAuthenticated, logout } = useAuth();
  const location = useLocation(); // Get current location for active link styling

  // Helper function to check if a route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const activeClass = "bg-accent text-accent-foreground";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center">
          <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-skillspark-purple to-skillspark-darkpurple">
            SkillSpark
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          
          {!isAuthenticated && (
            <>
              <Button asChild variant={isActive("/register") ? "default" : "outline"}>
                <Link to="/register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Link>
              </Button>
              <Button asChild variant={isActive("/login") ? "default" : "secondary"}>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            </>
          )}

          {isAuthenticated && userType === 'sparky' && (
            <>
              <Button asChild variant={isActive("/sparkies/profile") ? "default" : "ghost"}>
                <Link to="/sparkies/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Your Profile
                </Link>
              </Button>
              <Button asChild variant={isActive("/sparkies/add-skill") ? "default" : "ghost"}>
                <Link to="/sparkies/add-skill">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add new Skill
                </Link>
              </Button>
              <Button asChild variant={isActive("/clients/open-projects") ? "default" : "ghost"}>
                <Link to="/clients/open-projects">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Open Projects
                </Link>
              </Button>
              <Button asChild variant={isActive("/sparkies/fund-raise") ? "default" : "ghost"}>
                <Link to="/sparkies/fund-raise">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Fund Raise
                </Link>
              </Button>
            </>
          )}

          {isAuthenticated && userType === 'client' && (
            <>
              <Button asChild variant={isActive("/clients/profile") ? "default" : "ghost"}>
                <Link to="/clients/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Your Profile
                </Link>
              </Button>
              <Button asChild variant={isActive("/clients/book-sparky") ? "default" : "ghost"}>
                <Link to="/clients/book-sparky">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book a Sparky
                </Link>
              </Button>
              <Button asChild variant={isActive("/clients/open-projects") ? "default" : "ghost"}>
                <Link to="/clients/open-projects">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Open Projects
                </Link>
              </Button>
              <Button asChild variant={isActive("/clients/consult-mentor") ? "default" : "ghost"}>
                <Link to="/clients/consult-mentor">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Consult Mentor
                </Link>
              </Button>
              <Button asChild variant={isActive("/clients/resources") ? "default" : "ghost"}>
                <Link to="/clients/resources">
                  <FileText className="mr-2 h-4 w-4" />
                  Resources
                </Link>
              </Button>
              <Button asChild variant={isActive("/clients/fund-raise") ? "default" : "ghost"}>
                <Link to="/clients/fund-raise">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Fund Raise
                </Link>
              </Button>
            </>
          )}

          {isAuthenticated && (
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
