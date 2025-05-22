
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { checkSupabaseConnection } from "./integrations/supabase/client";

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

// Configure QueryClient with retry logic and error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      // Updated to use the correct structure for error handling in latest TanStack Query
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
          toast.error("Failed to fetch data. Please check your connection and try again.");
        }
      }
    }
  }
});

// Create an AdminRoute component to protect admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, checkIsAdmin } = useAuth();
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  
  useEffect(() => {
    // Check Supabase connection when component mounts
    const checkConnection = async () => {
      const { connected, error } = await checkSupabaseConnection();
      if (!connected) {
        console.error('Supabase connection issue:', error);
        toast.error("Connection to the database failed. Some features may be unavailable.");
      }
      setConnectionChecked(true);
    };
    
    checkConnection();
  }, []);
  
  useEffect(() => {
    if (user && connectionChecked) {
      // Check admin status explicitly when this component mounts
      setIsCheckingAdmin(true);
      checkIsAdmin()
        .then(isAdminResult => {
          setIsCheckingAdmin(false);
        })
        .catch(err => {
          console.error("Failed to check admin status:", err);
          setIsCheckingAdmin(false);
        });
    } else {
      setIsCheckingAdmin(false);
    }
  }, [user, checkIsAdmin, connectionChecked]);
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (isAdmin === false) {
    toast.error("You don't have admin privileges to access this page.");
    return <Navigate to="/" />;
  }

  // If still checking admin status, show a loading state
  if (isAdmin === null || isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
};

const App = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  
  useEffect(() => {
    // Check Supabase connection when app loads
    const checkConnection = async () => {
      try {
        const { connected } = await checkSupabaseConnection();
        setConnectionStatus(connected ? 'connected' : 'error');
        
        if (!connected) {
          toast.error("Connection to the database failed. Some features may be unavailable.");
        }
      } catch (err) {
        console.error('Connection check error:', err);
        setConnectionStatus('error');
        toast.error("Connection to the database failed. Some features may be unavailable.");
      }
    };
    
    checkConnection();
    
    // Setup periodic connection checks
    const intervalId = setInterval(checkConnection, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <div className="overflow-x-hidden max-w-[100vw]">
              {connectionStatus === 'error' && (
                <div className="bg-red-500 text-white p-2 text-center text-sm">
                  Database connection issues detected. Some features may not work properly.
                </div>
              )}
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
};

export default App;
