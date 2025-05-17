
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, Mail } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { toast } from "@/components/ui/sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const { signIn, signUp, user } = useAuth();
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    terms: ''
  });
  
  // Redirect if already logged in - without showing toast
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);
  
  // If user is already logged in, return null to prevent rendering the component
  if (user) return null;

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    
    // Clear errors when user types
    if (id === 'username' || id === 'email' || id === 'password') {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
    
    // Validate username as user types (no spaces or special characters)
    if (id === 'username') {
      // This regex only allows letters, numbers, and underscores (no spaces)
      const usernameRegex = /^[a-zA-Z0-9_]*$/;
      if (value && !usernameRegex.test(value)) {
        setErrors(prev => ({
          ...prev,
          username: 'Username can only contain letters, numbers, and underscores'
        }));
        return; // Don't update state with invalid username
      }
    }
    
    setSignupData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await signIn(loginData.email, loginData.password);
    
    setIsLoading(false);
    
    if (error) {
      toast.error(error.message);
    } else {
      navigate(from);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({
      username: '',
      email: '',
      password: '',
      terms: ''
    });
    
    // Validate all fields
    let hasErrors = false;
    
    if (!signupData.email || !signupData.password || !signupData.firstName || !signupData.username) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!signupData.agreeToTerms) {
      setErrors(prev => ({
        ...prev,
        terms: "You must agree to the Terms of Service and Privacy Policy"
      }));
      hasErrors = true;
    }
    
    if (hasErrors) {
      return;
    }
    
    setIsLoading(true);
    
    const userData = {
      username: signupData.username,
      first_name: signupData.firstName,
      last_name: signupData.lastName || '',
    };
    
    const { error, isUsernameError, isEmailError } = await signUp(signupData.email, signupData.password, userData);
    
    setIsLoading(false);
    
    if (error) {
      if (isUsernameError) {
        setErrors(prev => ({
          ...prev,
          username: error.message
        }));
      } else if (isEmailError) {
        setErrors(prev => ({
          ...prev,
          email: error.message
        }));
      } else {
        toast.error(error.message);
      }
    } else {
      uiToast({
        title: "Account created",
        description: "Please check your email for verification instructions.",
      });
    }
  };
  
  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      
      if (error) {
        toast.error(error.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-secondary/30 backdrop-blur-lg rounded-lg border border-white/10 p-8"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent mb-4"></div>
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Sign in to access premium projects and features
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <Button 
                variant="outline" 
                className="w-full border-white/10" 
                onClick={() => handleOAuthLogin('github')}
                disabled={isLoading}
              >
                <Github className="mr-2 h-4 w-4" /> Continue with GitHub
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-white/10" 
                onClick={() => handleOAuthLogin('google')}
                disabled={isLoading}
              >
                <Mail className="mr-2 h-4 w-4" /> Continue with Google
              </Button>
            </div>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-secondary px-2 text-muted-foreground">or continue with</span>
              </div>
            </div>
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required 
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="rememberMe" 
                      checked={loginData.rememberMe}
                      onCheckedChange={(checked) => 
                        setLoginData(prev => ({ ...prev, rememberMe: checked === true }))}
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input 
                        id="firstName" 
                        value={signupData.firstName}
                        onChange={handleSignupChange}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input 
                        id="lastName" 
                        value={signupData.lastName}
                        onChange={handleSignupChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      value={signupData.username}
                      onChange={handleSignupChange}
                      required 
                      placeholder="Choose a unique username"
                      className={errors.username ? "border-red-500" : ""}
                    />
                    {errors.username && (
                      <p className="text-sm text-red-500">{errors.username}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={signupData.email}
                      onChange={handleSignupChange}
                      required 
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={signupData.password}
                      onChange={handleSignupChange}
                      required 
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Password must contain at least one lowercase letter, one uppercase letter, and one number.
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="agreeToTerms" 
                      required
                      checked={signupData.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setSignupData(prev => ({ ...prev, agreeToTerms: checked === true }))}
                      className={errors.terms ? "border-red-500" : ""}
                    />
                    <div>
                      <label
                        htmlFor="agreeToTerms"
                        className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                      </label>
                      {errors.terms && (
                        <p className="text-xs text-red-500 mt-1">{errors.terms}</p>
                      )}
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
