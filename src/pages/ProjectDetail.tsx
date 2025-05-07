
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock, ExternalLink, Code, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { projects } from '@/data/projects';
import { useToast } from "@/components/ui/use-toast";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [project, setProject] = useState(projects.find(p => p.id === id));
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if project exists
    if (!project) {
      navigate('/projects');
    }
    
    // This is a placeholder for actual authentication checking
    // In a real implementation, this would use your auth system
    const checkAuth = () => {
      const fakeAuth = localStorage.getItem('authenticated');
      setIsAuthenticated(fakeAuth === 'true');
    };
    
    checkAuth();
  }, [project, navigate]);
  
  const handleLoginPrompt = () => {
    toast({
      title: "Authentication Required",
      description: "Please log in to access this premium content.",
      variant: "destructive",
    });
    navigate('/login');
  };
  
  const handleDownload = () => {
    if (project?.isPremium && !isAuthenticated) {
      handleLoginPrompt();
      return;
    }
    
    // Simulate download for demo purposes
    toast({
      title: "Download Started",
      description: "Your download will begin shortly.",
    });
  };
  
  if (!project) return null;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-8"
          >
            <ChevronLeft size={16} />
            <span>Back to Projects</span>
          </Link>
          
          {/* Project Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                {project.isPremium ? (
                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary">
                    <Lock size={12} className="mr-1" /> Premium
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-accent/20 text-accent border-accent">
                    Free
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground mb-6">
                {project.longDescription}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/5">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4 mb-8">
                {project.demoUrl && (
                  <Button asChild className="flex items-center gap-2">
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <Eye size={16} /> Live Demo
                    </a>
                  </Button>
                )}
                
                <Button 
                  variant={project.isPremium && !isAuthenticated ? "outline" : "default"}
                  onClick={handleDownload}
                  className={project.isPremium && !isAuthenticated ? "border-white/10" : ""}
                >
                  <div className="flex items-center gap-2">
                    {project.isPremium && !isAuthenticated ? (
                      <>
                        <Lock size={16} /> Get Access
                      </>
                    ) : (
                      <>
                        <Code size={16} /> Download Source
                      </>
                    )}
                  </div>
                </Button>
                
                {project.repoUrl && !project.isPremium && (
                  <Button variant="outline" asChild className="border-white/10">
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <ExternalLink size={16} /> View Repository
                    </a>
                  </Button>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mt-0.5">✓</span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="overflow-hidden rounded-lg animated-border"
            >
              <div className="p-1">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-auto rounded-lg" 
                />
              </div>
            </motion.div>
          </div>
          
          {/* Premium Content Notice */}
          {project.isPremium && !isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="neo-blur rounded-lg p-6 mb-12"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Lock size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
                  <p className="text-muted-foreground mb-4">
                    This is a premium project. Sign in or subscribe to download the source code and access detailed documentation.
                  </p>
                  <div className="flex gap-4">
                    <Button asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button variant="outline" asChild className="border-white/10">
                      <Link to="/pricing">View Pricing</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Related Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter(p => p.id !== project.id && p.category === project.category)
                .slice(0, 3)
                .map(relatedProject => (
                  <Link 
                    to={`/projects/${relatedProject.id}`} 
                    key={relatedProject.id} 
                    className="group bg-secondary/50 rounded-lg overflow-hidden hover-scale"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedProject.image}
                        alt={relatedProject.title}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{relatedProject.title}</h3>
                        {relatedProject.isPremium ? (
                          <Badge variant="outline" className="bg-primary/20 text-primary border-primary h-5">
                            <Lock size={10} className="mr-1" /> Premium
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-accent/20 text-accent border-accent h-5">
                            Free
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{relatedProject.description}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectDetail;
