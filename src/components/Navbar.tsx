import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Github, Linkedin, Twitter, LogOut, UserRound, Settings, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return '?';
    // Prefer username first, then email
    if (user.user_metadata?.username) {
      return user.user_metadata.username.substring(0, 1).toUpperCase();
    }
    return user.email ? user.email.substring(0, 1).toUpperCase() : '?';
  };

  const goToProfile = () => {
    navigate('/profile');
    setIsMobileMenuOpen(false);
  };

  const goToPricing = () => {
    navigate('/pricing');
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-500 ${
        isScrolled ? 'py-2 glass-morphism border-b border-white/10' : 'py-4 md:py-6 bg-transparent'
      }`}
      style={{ maxWidth: '100vw', overflowX: 'hidden' }}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            className="relative h-8 w-8 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse"></div>
            <div className="absolute inset-[2px] rounded-full bg-background"></div>
            <div className="absolute inset-[4px] rounded-full bg-gradient-to-br from-primary/20 to-accent/20"></div>
          </motion.div>
          <motion.span 
            className="text-xl font-bold tracking-tighter text-gradient"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Portfolio.
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/projects" className="text-sm font-medium hover:text-primary transition-colors">Projects</Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
          </motion.div>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex gap-4">
            <motion.a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Github size={20} className="text-muted-foreground hover:text-primary transition-colors" />
            </motion.a>
            <motion.a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn"
              whileHover={{ scale: 1.2, rotate: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Linkedin size={20} className="text-muted-foreground hover:text-primary transition-colors" />
            </motion.a>
            <motion.a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Twitter"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Twitter size={20} className="text-muted-foreground hover:text-primary transition-colors" />
            </motion.a>
          </div>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-4">
                  <Avatar className="h-8 w-8 transition-transform hover:scale-110">
                    <AvatarImage src={user.user_metadata?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={goToProfile} className="px-3 py-2 cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/subscription')} className="px-3 py-2 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>My Subscription</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 px-3 py-2 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button variant="outline" size="sm" className="ml-4 border-white/10 hover:bg-white/5 hover:text-primary">
                <Link to="/login">Login</Link>
              </Button>
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button 
          className="md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isMobileMenuOpen ? 
            <X size={24} className="text-white" /> : 
            <Menu size={24} className="text-white" />}
        </motion.button>
      </div>

      {/* Mobile Navigation - Improved Design */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 z-50 bg-gradient-to-b from-background to-background/95 backdrop-blur-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex flex-col h-full">
              {/* Header with logo and close button */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="relative h-8 w-8 overflow-hidden">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse"></div>
                    <div className="absolute inset-[2px] rounded-full bg-background"></div>
                    <div className="absolute inset-[4px] rounded-full bg-gradient-to-br from-primary/20 to-accent/20"></div>
                  </div>
                  <span className="text-xl font-bold tracking-tighter">Portfolio.</span>
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-white/5"
                  aria-label="Close Menu"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
              
              {/* User profile section if logged in */}
              {user && (
                <div className="p-4 border-b border-white/10 flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.user_metadata?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.user_metadata?.username || 'User'}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {user.email}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation links */}
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1">
                  {[
                    { name: 'Home', path: '/' },
                    { name: 'Projects', path: '/projects' },
                    { name: 'Pricing', path: '/pricing' },
                    { name: 'About', path: '/about' },
                    { name: 'Contact', path: '/contact' },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-base font-medium transition-colors ${
                        location.pathname === item.path 
                          ? 'bg-white/5 text-primary border-l-4 border-primary' 
                          : 'hover:bg-white/5'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              
              {/* Bottom action buttons */}
              <div className="p-4 border-t border-white/10 space-y-3">
                {user ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={goToProfile}
                    >
                      <User className="mr-2 h-5 w-5" /> 
                      My Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        navigate('/subscription');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Settings className="mr-2 h-5 w-5" /> 
                      My Subscription
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-5 w-5" /> 
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button className="w-full">
                    <Link 
                      to="/login" 
                      className="w-full flex justify-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login / Sign Up
                    </Link>
                  </Button>
                )}
                
                {/* Social links */}
                <div className="flex justify-center gap-6 pt-3">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github size={22} className="text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin size={22} className="text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <Twitter size={22} className="text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
