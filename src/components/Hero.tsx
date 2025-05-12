
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { ArrowDownCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Gradient spotlight that follows cursor */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.15), transparent 40%)`,
        }}
      />
      
      {/* Background grid */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" style={{ backgroundSize: '60px 60px' }}></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/4 h-40 w-40 rounded-full bg-primary/5 blur-3xl animate-float" style={{animationDelay: "0s"}}></div>
      <div className="absolute bottom-1/4 right-1/4 h-60 w-60 rounded-full bg-accent/5 blur-3xl animate-float" style={{animationDelay: "1s"}}></div>
      <div className="absolute top-1/2 right-1/3 h-20 w-20 rounded-full bg-primary/10 blur-2xl animate-float" style={{animationDelay: "2s"}}></div>
      
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-gradient">Creative Developer</span><br/>
            <span className="primary-gradient">Crafting Digital</span><br/>
            <span className="accent-gradient">Experiences</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A showcase of my projects and explorations in design and development. 
            Building memorable digital experiences with modern technologies.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              <Link to="/projects" className="flex items-center gap-2">
                View Projects <ExternalLink size={18} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/10 hover:bg-white/5">
              <Link to="/contact" className="flex items-center gap-2">
                Contact Me <ArrowDownCircle size={18} />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 1.2,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.5
          }}
        >
          <ArrowDownCircle size={32} className="text-muted-foreground" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
