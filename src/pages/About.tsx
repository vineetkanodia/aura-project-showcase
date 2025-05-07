
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative pb-20">
          <div className="absolute inset-0 z-0">
            <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" style={{ backgroundSize: '60px 60px' }}></div>
          </div>
          
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent/5 blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">About Me</h1>
              <p className="text-lg text-muted-foreground">
                I'm a passionate developer and designer focused on creating beautiful,
                functional, and user-centered digital experiences.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Bio Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <motion.div 
                className="lg:col-span-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="animated-border p-1">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-white/5">
                    <img 
                      src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1470&auto=format&fit=crop" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="lg:col-span-8"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-3xl font-bold mb-6">My Journey</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Hi, I'm John Doe, a passionate software developer and designer with over 5 years of experience in creating
                    digital products. My journey in tech began when I built my first website at the age of 14, and I've been
                    hooked ever since.
                  </p>
                  <p>
                    I specialize in front-end development with a focus on creating beautiful, intuitive interfaces that provide
                    exceptional user experiences. My approach combines technical expertise with design thinking, ensuring that
                    the products I build are not only functional but also engaging and accessible.
                  </p>
                  <p>
                    My educational background includes a Bachelor's degree in Computer Science from MIT and a certification
                    in UI/UX Design from the Interaction Design Foundation. This dual perspective allows me to bridge the gap
                    between technical implementation and user-centered design.
                  </p>
                  <p>
                    When I'm not coding, you can find me exploring new design trends, contributing to open-source projects,
                    or sharing my knowledge through technical articles and tutorials. I believe in continuous learning and
                    staying at the forefront of web development technologies.
                  </p>
                </div>
                
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold primary-gradient">5+</p>
                    <p className="text-sm text-muted-foreground">Years of Experience</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold primary-gradient">50+</p>
                    <p className="text-sm text-muted-foreground">Projects Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold primary-gradient">30+</p>
                    <p className="text-sm text-muted-foreground">Happy Clients</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold primary-gradient">12+</p>
                    <p className="text-sm text-muted-foreground">Awards Won</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Skills Section */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">My Skills & Expertise</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                I've worked with a wide range of technologies across the full stack,
                with a particular focus on modern frontend development.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white/5 rounded-lg p-6 backdrop-blur-sm hover-scale"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Frontend Development</h3>
                <p className="text-sm text-muted-foreground mb-4">Building responsive and accessible user interfaces with modern frameworks.</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    React & Next.js
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    TypeScript
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    Tailwind CSS & Styled Components
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    Framer Motion & GSAP
                  </li>
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white/5 rounded-lg p-6 backdrop-blur-sm hover-scale"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6" y1="6" y2="6"/><line x1="6" x2="6" y1="18" y2="18"/></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Backend Development</h3>
                <p className="text-sm text-muted-foreground mb-4">Creating robust server-side applications and APIs for web services.</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    Node.js & Express
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    PostgreSQL & MongoDB
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    GraphQL & REST APIs
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    Supabase & Firebase
                  </li>
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white/5 rounded-lg p-6 backdrop-blur-sm hover-scale"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">UI/UX Design</h3>
                <p className="text-sm text-muted-foreground mb-4">Creating user-centered designs with a focus on usability and aesthetics.</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    Figma & Adobe XD
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    Wireframing & Prototyping
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    Design Systems
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    User Testing & Accessibility
                  </li>
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white/5 rounded-lg p-6 backdrop-blur-sm hover-scale"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/><path d="M12 22v-4"/></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Creative Development</h3>
                <p className="text-sm text-muted-foreground mb-4">Pushing the boundaries of web experiences with creative coding.</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    Three.js & WebGL
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    Canvas & SVG Animations
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    Experimental Interfaces
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs mr-2">✓</span>
                    Interactive Storytelling
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
