import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute, PublicOnlyRoute } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CreditsProvider } from "@/context/CreditsContext";
import { SessionsProvider } from "@/context/SessionsContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Sparky pages
import SparkyProfile from "./pages/sparkies/Profile";
import SparkyDashboard from "./pages/sparkies/Dashboard";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
    <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

    {/* Sparky-only routes */}
    <Route path="/sparkies/onboarding" element={<ProtectedRoute role="sparky"><SparkyOnboarding /></ProtectedRoute>} />
    <Route path="/sparkies/dashboard" element={<ProtectedRoute role="sparky"><SparkyDashboard /></ProtectedRoute>} />
    <Route path="/sparkies/profile" element={<ProtectedRoute role="sparky"><SparkyProfile /></ProtectedRoute>} />
    <Route path="/sparkies/add-skill" element={<ProtectedRoute role="sparky"><AddSkill /></ProtectedRoute>} />
    <Route path="/sparkies/fund-raise" element={<ProtectedRoute role="sparky"><SparkyFundRaise /></ProtectedRoute>} />

    {/* Client-only routes */}
    <Route path="/clients/profile" element={<ProtectedRoute role="client"><ClientProfile /></ProtectedRoute>} />
    <Route path="/clients/book-sparky" element={<ProtectedRoute role="client"><BookSparky /></ProtectedRoute>} />
    <Route path="/clients/consult-mentor" element={<ProtectedRoute role="client"><ConsultMentor /></ProtectedRoute>} />
    <Route path="/clients/resources" element={<ProtectedRoute role="client"><Resources /></ProtectedRoute>} />
    <Route path="/clients/resources/:id" element={<ProtectedRoute role="client"><ResourceDetail /></ProtectedRoute>} />
    <Route path="/clients/fund-raise" element={<ProtectedRoute role="client"><ClientFundRaise /></ProtectedRoute>} />
    <Route path="/clients/open-projects" element={<ProtectedRoute><OpenProjects /></ProtectedRoute>} />
    <Route path="/clients/create-project" element={<ProtectedRoute role="client"><CreateProject /></ProtectedRoute>} />
    <Route path="/clients/project/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
    <Route path="/clients/payments" element={<ProtectedRoute role="client"><Payments /></ProtectedRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

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
