
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "next-themes";
import { useState, useEffect, useCallback } from "react";
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
      // Updated structure for error handling in latest TanStack Query
      meta: {
        onSettled: (data: unknown, error: Error | null) => {
          if (error) {
            console.error('Query error:', error);
            toast.error("Failed to fetch data. Please check your connection and try again.");
          }
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
  const [retryCount, setRetryCount] = useState(0);
  
  // Create a memoized version of the connection check function
  const checkConnection = useCallback(async () => {
    try {
      const { connected, error, isTimeout } = await checkSupabaseConnection();
      
      if (connected) {
        setConnectionStatus('connected');
        setRetryCount(0); // Reset retry count on successful connection
      } else {
        setConnectionStatus('error');
        console.error('Connection check error:', error);
        
        // Show error toast, but not on every retry to avoid spamming
        if (retryCount < 3) {
          toast.error(
            isTimeout 
              ? "Connection to the database timed out. Retrying..." 
              : "Connection to the database failed. Some features may be unavailable."
          );
        }
        
        // Increment retry counter
        setRetryCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Connection check exception:', err);
      setConnectionStatus('error');
      
      if (retryCount < 3) {
        toast.error("Connection to the database failed. Some features may be unavailable.");
      }
      setRetryCount(prev => prev + 1);
    }
  }, [retryCount]);
  
  useEffect(() => {
    // Initial connection check
    checkConnection();
    
    // Setup periodic connection checks - more frequent when in error state
    const checkInterval = connectionStatus === 'error' ? 15000 : 60000;
    const intervalId = setInterval(checkConnection, checkInterval);
    
    return () => clearInterval(intervalId);
  }, [checkConnection, connectionStatus]);

  // Auto-retry connection feature
  useEffect(() => {
    let retryTimer: NodeJS.Timeout | null = null;
    
    if (connectionStatus === 'error') {
      // Exponential backoff for retries (up to 30 seconds)
      const retryDelay = Math.min(2000 * (2 ** Math.min(retryCount, 4)), 30000);
      
      retryTimer = setTimeout(() => {
        console.log(`Automatic retry attempt ${retryCount + 1}...`);
        checkConnection();
      }, retryDelay);
    }
    
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [connectionStatus, retryCount, checkConnection]);

  // Allow manual retry
  const handleRetryConnection = () => {
    toast.info("Attempting to reconnect to database...");
    checkConnection();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <div className="overflow-x-hidden max-w-[100vw]">
              {connectionStatus === 'error' && (
                <div className="bg-red-500 text-white p-2 text-center text-sm flex justify-center items-center gap-2">
                  <span>Database connection issues detected. Some features may not work properly.</span>
                  <button 
                    onClick={handleRetryConnection}
                    className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs transition-colors"
                  >
                    Retry Connection
                  </button>
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
