import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CreditsProvider } from "@/context/CreditsContext";
import { SessionsProvider } from "@/context/SessionsContext";
import { useAuth } from "@/context/AuthContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Sparky pages
import SparkyProfile from "./pages/sparkies/Profile";
import AddSkill from "./pages/sparkies/AddSkill";
import SparkyFundRaise from "./pages/sparkies/FundRaise";
import SparkyOnboarding from "./pages/sparkies/Onboarding";

// Client pages
import ClientProfile from "./pages/clients/Profile";
import BookSparky from "./pages/clients/BookSparky";
import ConsultMentor from "./pages/clients/ConsultMentor";
import Resources from "./pages/clients/Resources";
import ClientFundRaise from "./pages/clients/FundRaise";
import OpenProjects from "./pages/clients/OpenProjects";
import CreateProject from "./pages/clients/CreateProject";
import ProjectDetails from "./pages/clients/ProjectDetails";
import ResourceDetail from "./pages/clients/ResourceDetail";
import Payments from "./pages/clients/Payments";

const queryClient = new QueryClient();

// Route guard for authenticated users trying to access public pages
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, userType } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to={userType === 'sparky' ? '/sparkies/profile' : '/clients/profile'} />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <Index />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      
      {/* Sparky routes */}
      <Route path="/sparkies/profile" element={<SparkyProfile />} />
      <Route path="/sparkies/add-skill" element={<AddSkill />} />
      <Route path="/sparkies/fund-raise" element={<SparkyFundRaise />} />
      <Route path="/sparkies/onboarding" element={<SparkyOnboarding />} />
      
      {/* Client routes */}
      <Route path="/clients/profile" element={<ClientProfile />} />
      <Route path="/clients/book-sparky" element={<BookSparky />} />
      <Route path="/clients/consult-mentor" element={<ConsultMentor />} />
      <Route path="/clients/resources" element={<Resources />} />
      <Route path="/clients/resources/:id" element={<ResourceDetail />} />
      <Route path="/clients/fund-raise" element={<ClientFundRaise />} />
      <Route path="/clients/open-projects" element={<OpenProjects />} />
      <Route path="/clients/create-project" element={<CreateProject />} />
      <Route path="/clients/project/:id" element={<ProjectDetails />} />
      <Route path="/clients/payments" element={<Payments />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CreditsProvider>
          <SessionsProvider>
            <ThemeProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <AppRoutes />
              </TooltipProvider>
            </ThemeProvider>
          </SessionsProvider>
        </CreditsProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
