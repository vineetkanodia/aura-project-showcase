
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeProvider";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Contact from "@/pages/Contact";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import NotFound from "@/pages/NotFound";
import PrivateRoute from "@/components/PrivateRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-right" />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
