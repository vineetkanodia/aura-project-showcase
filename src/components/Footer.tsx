
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email validation function
  const isValidEmail = (email: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if email already exists
      const { data: existingSubscribers, error: checkError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('email', email)
        .limit(1);

      if (checkError) {
        console.error('Error checking subscription:', checkError);
        toast.error('Failed to subscribe. Please try again later.');
        setIsSubmitting(false);
        return;
      }

      if (existingSubscribers && existingSubscribers.length > 0) {
        toast.info('This email is already subscribed to our newsletter');
        setIsSubmitting(false);
        return;
      }

      // Insert new subscriber
      const { error } = await supabase
        .from('subscribers')
        .insert({ email });

      if (error) {
        console.error('Error adding subscription:', error);
        toast.error('Failed to subscribe. Please try again later.');
        setIsSubmitting(false);
        return;
      }

      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-white/10 bg-background/50 backdrop-blur-md">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="relative h-8 w-8 overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent"></div>
                <div className="absolute inset-[2px] rounded-full bg-background"></div>
                <div className="absolute inset-[4px] rounded-full bg-gradient-to-br from-primary/20 to-accent/20"></div>
              </div>
              <span className="text-xl font-bold tracking-tighter text-gradient">Portfolio.</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              A showcase of my projects and explorations in design and development.
              Building memorable digital experiences with modern technologies.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} className="text-white" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} className="text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} className="text-white" />
              </a>
              <a
                href="mailto:hello@example.com"
                className="h-10 w-10 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors"
                aria-label="Email"
              >
                <Mail size={18} className="text-white" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get notified when I release new projects or write articles about design and development.
            </p>
            <form className="flex gap-2" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email"
                className="flex h-10 rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025. All rights reserved.
          </p>
          <div className="flex items-center gap-1 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">Made with</span>
            <Heart size={14} className="text-primary" />
            <span className="text-sm text-muted-foreground">using React, Tailwind and Framer Motion</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
