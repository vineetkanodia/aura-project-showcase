
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Lock, Eye, Code, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  isPremium: boolean;
}

const ProjectCard = ({ id, title, description, image, tags, isPremium }: ProjectCardProps) => {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-lg bg-secondary/50 hover-scale animated-border"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Link to={`/projects/${id}`} className="block">
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold">{title}</h3>
            {isPremium ? (
              <Badge variant="outline" className="bg-primary/20 text-primary border-primary">
                <Lock size={12} className="mr-1" /> Premium
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-accent/20 text-accent border-accent">
                Free
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-white/5 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>View Details</span>
            </div>
            <div className="flex items-center gap-1">
              {isPremium ? (
                <>
                  <Lock size={14} />
                  <span>Premium Access</span>
                </>
              ) : (
                <>
                  <Code size={14} />
                  <span>View Source</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="absolute top-3 right-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur text-white">
            <ExternalLink size={14} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
