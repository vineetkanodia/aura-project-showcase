
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProjectCard from '@/components/ProjectCard';
import Footer from '@/components/Footer';
import { projects } from '@/data/projects';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Featured projects (take the first 3)
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Featured Projects Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore a selection of my recent work. Each project represents a unique challenge and solution.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  tags={project.tags}
                  isPremium={project.isPremium}
                />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild className="group">
                <Link to="/projects" className="flex items-center gap-2">
                  View All Projects 
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">About Me</h2>
                <p className="text-muted-foreground mb-6">
                  I'm a passionate developer and designer focused on creating beautiful, functional, and user-centered digital experiences. With expertise in frontend development and UI/UX design, I strive to build products that are both visually appealing and highly usable.
                </p>
                <p className="text-muted-foreground mb-6">
                  My journey in web development started over 5 years ago, and I've since worked on a variety of projects ranging from small business websites to complex web applications. I specialize in React, TypeScript, and modern frontend technologies.
                </p>
                <Button asChild variant="outline" className="border-white/10 hover:bg-white/5">
                  <Link to="/about">Read More About Me</Link>
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                <div className="animated-border p-1">
                  <div className="bg-white/5 rounded-lg p-8 backdrop-blur-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <h4 className="text-lg font-bold primary-gradient">Frontend</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>React & Next.js</li>
                          <li>TypeScript</li>
                          <li>Tailwind CSS</li>
                          <li>Framer Motion</li>
                        </ul>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h4 className="text-lg font-bold primary-gradient">Backend</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>Node.js</li>
                          <li>Express</li>
                          <li>PostgreSQL</li>
                          <li>Supabase</li>
                        </ul>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h4 className="text-lg font-bold primary-gradient">Design</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>Figma</li>
                          <li>Adobe XD</li>
                          <li>UI/UX Design</li>
                          <li>Prototyping</li>
                        </ul>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h4 className="text-lg font-bold primary-gradient">Other</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>Git & GitHub</li>
                          <li>Responsive Design</li>
                          <li>Testing (Jest)</li>
                          <li>Performance Optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-primary/20 blur-3xl -z-10"></div>
                <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-accent/20 blur-3xl -z-10"></div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to work together?</h2>
              <p className="text-muted-foreground mb-8">
                I'm currently available for freelance projects, collaboration opportunities, or full-time positions.
                Let's create something amazing together!
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
