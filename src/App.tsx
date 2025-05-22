
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "next-themes";

import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import Subscription from "./pages/Subscription";
import Admin from "./pages/Admin";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Create an AdminRoute component to protect admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, checkIsAdmin } = useAuth();
  
  useEffect(() => {
    if (user) {
      // Check admin status explicitly when this component mounts
      checkIsAdmin();
    }
  }, [user, checkIsAdmin]);
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (isAdmin === false) {
    return <Navigate to="/" />;
  }

  // If still checking admin status, show a loading state
  if (isAdmin === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark">
      <AuthProvider>
        <TooltipProvider>
          <div className="overflow-x-hidden max-w-[100vw]">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={
                  <PrivateRoute>
                    <ProjectDetail />
                  </PrivateRoute>
                } />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/subscription" element={
                  <PrivateRoute>
                    <Subscription />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/admin" element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
