
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { toast } from '@/components/ui/sonner';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.email) return '?';
    return user.email.substring(0, 2).toUpperCase();
  };

  const goToProfile = () => {
    navigate('/profile');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'py-2 glass-morphism border-b border-white/10' : 'py-4 md:py-6 bg-transparent'}`}>
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse"></div>
            <div className="absolute inset-[2px] rounded-full bg-background"></div>
            <div className="absolute inset-[4px] rounded-full bg-gradient-to-br from-primary/20 to-accent/20"></div>
          </div>
          <span className="text-xl font-bold tracking-tighter text-gradient">Portfolio.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/projects" className="text-sm font-medium hover:text-primary transition-colors">Projects</Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github size={20} className="text-muted-foreground hover:text-primary transition-colors" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={20} className="text-muted-foreground hover:text-primary transition-colors" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={20} className="text-muted-foreground hover:text-primary transition-colors" />
            </a>
          </div>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-4">
                  <Avatar className="h-8 w-8">
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
                  <DropdownMenuItem onClick={goToProfile} className="px-3 py-2 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
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
            <Button variant="outline" size="sm" className="ml-4 border-white/10 hover:bg-white/5 hover:text-primary">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? 
            <X size={24} className="text-white" /> : 
            <Menu size={24} className="text-white" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center space-y-6 animate-fade-in">
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2"
            aria-label="Close Menu"
          >
            <X size={24} className="text-white" />
          </button>
          
          <Link 
            to="/" 
            className="text-xl font-medium hover:text-primary transition-colors" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/projects" 
            className="text-xl font-medium hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Projects
          </Link>
          <Link 
            to="/about" 
            className="text-xl font-medium hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-xl font-medium hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          
          <div className="flex gap-6 mt-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github size={24} className="text-muted-foreground hover:text-primary transition-colors" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={24} className="text-muted-foreground hover:text-primary transition-colors" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={24} className="text-muted-foreground hover:text-primary transition-colors" />
            </a>
          </div>
          
          {user ? (
            <div className="mt-6 flex flex-col items-center">
              <Avatar className="h-12 w-12 mb-3">
                <AvatarImage src={user.user_metadata?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/20 text-primary-foreground">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="text-lg font-medium mb-2">{user.email}</span>
              <div className="flex flex-col gap-2 w-full mt-2">
                <Button 
                  variant="outline" 
                  className="w-full border-white/10 hover:bg-white/5"
                  onClick={goToProfile}
                >
                  <User className="mr-2 h-5 w-5" /> My Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-white/10 hover:bg-white/5"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-5 w-5" /> Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="lg" className="mt-4 border-white/10 hover:bg-white/5">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </Link>
            </Button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
