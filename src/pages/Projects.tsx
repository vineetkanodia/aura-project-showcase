
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import ProjectFilter from '@/components/ProjectFilter';
import { projects, categories } from '@/data/projects';

const Projects = () => {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [filters, setFilters] = useState({
    search: '',
    categories: [] as string[],
    premiumOnly: false,
    freeOnly: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let result = [...projects];

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        project =>
          project.title.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter(project =>
        filters.categories.includes(project.category)
      );
    }

    // Filter by premium/free
    if (filters.premiumOnly) {
      result = result.filter(project => project.isPremium);
    } else if (filters.freeOnly) {
      result = result.filter(project => !project.isPremium);
    }

    setFilteredProjects(result);
  }, [filters]);

  const handleFilterChange = (newFilters: {
    search: string;
    categories: string[];
    premiumOnly: boolean;
    freeOnly: boolean;
  }) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Projects Hero Section */}
        <section className="pt-32 pb-12 relative overflow-hidden">
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">My Projects</h1>
              <p className="text-muted-foreground">
                Explore my portfolio of work, ranging from web applications to design systems.
                Filter by category or search for specific technologies.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Project Filters */}
        <ProjectFilter categories={categories} onFilterChange={handleFilterChange} />
        
        {/* Projects Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
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
            ) : (
              <div className="text-center py-24">
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search term to find projects.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Projects;
