
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { ArrowDownCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  
  // Create particles
  useEffect(() => {
    if (!particlesRef.current) return;
    
    const particlesContainer = particlesRef.current;
    const particles: HTMLDivElement[] = [];
    const particleCount = 30;
    
    // Remove existing particles
    while (particlesContainer.firstChild) {
      particlesContainer.removeChild(particlesContainer.firstChild);
    }
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random sizes between 2px and 6px
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random positions
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random opacity
      particle.style.opacity = `${Math.random() * 0.6 + 0.2}`;
      
      // Add animation with random duration
      const animationDuration = Math.random() * 15 + 10; // Between 10 and 25 seconds
      particle.style.animation = `float ${animationDuration}s ease-in-out infinite`;
      particle.style.animationDelay = `${Math.random() * animationDuration}s`;
      
      particlesContainer.appendChild(particle);
      particles.push(particle);
    }
    
    return () => {
      particles.forEach(p => {
        p.remove();
      });
    };
  }, []);
  
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Rotating gradient overlay */}
      <div className="rotating-gradient from-primary/20"></div>
      
      {/* Particles container */}
      <div ref={particlesRef} className="absolute inset-0 z-0 overflow-hidden"></div>
      
      {/* Gradient spotlight that follows cursor */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
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
      <div className="absolute top-1/2 right-1/3 h-20 w-20 rounded-full bg-primary/10 blur-2xl animate-pulse-glow" style={{animationDelay: "2s"}}></div>
      
      {/* Glowing orb */}
      <motion.div 
        className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/0 blur-3xl"
        animate={{ 
          x: [0, 10, -10, 0],
          y: [0, -10, 10, 0],
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 10,
          ease: "easeInOut" 
        }}
      />
      
      <div className="container mx-auto px-4 z-10 relative" ref={containerRef}>
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
            <span className="text-gradient-primary">Crafting Digital</span><br/>
            <span className="text-gradient-primary">Experiences</span>
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
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white glass-morphism">
              <Link to="/projects" className="flex items-center gap-2">
                View Projects <ExternalLink size={18} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/10 hover:bg-white/5 glass-morphism">
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
          <ArrowDownCircle size={32} className="text-primary animate-bounce-slow" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
