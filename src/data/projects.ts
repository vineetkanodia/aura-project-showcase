
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  category: string;
  isPremium: boolean;
  demoUrl?: string;
  repoUrl?: string;
  createdAt: string;
  features: string[];
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Dashboard',
    description: 'A responsive admin dashboard for e-commerce platforms with real-time analytics.',
    longDescription: 'A comprehensive dashboard for e-commerce platforms featuring real-time sales analytics, inventory management, and customer insights. Built with React, Redux, and D3.js for data visualization. The dashboard includes dark mode support, responsive design, and real-time notifications.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop',
    tags: ['React', 'TypeScript', 'Redux', 'D3.js'],
    category: 'Web App',
    isPremium: true,
    demoUrl: 'https://example.com/demo',
    createdAt: '2025-04-15',
    features: [
      'Real-time sales analytics',
      'Inventory management system',
      'Customer behavior insights',
      'Responsive design for all devices',
      'Dark mode support',
      'Export reports as PDF or CSV'
    ]
  },
  {
    id: '2',
    title: 'Portfolio Website',
    description: 'A minimalist portfolio website template for designers and developers.',
    longDescription: 'A clean, minimalist portfolio website template designed for creatives to showcase their work. Features smooth animations, project filtering, and a contact form. Built with React and styled using Tailwind CSS with a focus on performance and accessibility.',
    image: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=1374&auto=format&fit=crop',
    tags: ['React', 'Tailwind CSS', 'Framer Motion'],
    category: 'Web Design',
    isPremium: false,
    demoUrl: 'https://example.com/demo',
    repoUrl: 'https://github.com/example/portfolio',
    createdAt: '2025-03-22',
    features: [
      'Responsive design',
      'Project filtering by category',
      'Animated page transitions',
      'Light/dark mode toggle',
      'Contact form with validation',
      'SEO optimized'
    ]
  },
  {
    id: '3',
    title: 'Task Management App',
    description: 'A kanban-style task management application with drag and drop functionality.',
    longDescription: 'A productivity-focused task management application featuring kanban-style boards, drag and drop functionality, and team collaboration tools. Built with React, TypeScript, and React Beautiful DND. Includes features like task assignment, due dates, labels, and progress tracking.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1470&auto=format&fit=crop',
    tags: ['React', 'TypeScript', 'Redux', 'Firebase'],
    category: 'Web App',
    isPremium: true,
    demoUrl: 'https://example.com/demo',
    createdAt: '2025-02-10',
    features: [
      'Drag and drop task management',
      'User authentication and team collaboration',
      'Task assignments and due dates',
      'Custom labels and priorities',
      'Progress tracking and reporting',
      'Real-time updates using Firebase'
    ]
  },
  {
    id: '4',
    title: 'Recipe Finder',
    description: 'An app to discover recipes based on ingredients you have at home.',
    longDescription: 'A practical recipe discovery app that helps users find delicious meals based on ingredients they already have. Features a clean interface, ingredient-based search, and recipe saving functionality. Built with React and integrated with a recipe API.',
    image: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?q=80&w=1467&auto=format&fit=crop',
    tags: ['React', 'CSS', 'API Integration'],
    category: 'Web App',
    isPremium: false,
    demoUrl: 'https://example.com/demo',
    repoUrl: 'https://github.com/example/recipe-finder',
    createdAt: '2025-01-05',
    features: [
      'Search by multiple ingredients',
      'Filter by dietary restrictions',
      'Save favorite recipes',
      'Responsive mobile-first design',
      'Offline recipe storage',
      'Share recipes via social media'
    ]
  },
  {
    id: '5',
    title: 'Weather Dashboard',
    description: 'A beautiful weather app with 7-day forecasts and location-based updates.',
    longDescription: 'An elegant weather dashboard providing current conditions and 7-day forecasts with beautiful visualizations. Features location-based updates, hourly predictions, and weather alerts. Built with React and integrated with a weather API.',
    image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=1470&auto=format&fit=crop',
    tags: ['React', 'API Integration', 'CSS'],
    category: 'Web App',
    isPremium: false,
    demoUrl: 'https://example.com/demo',
    repoUrl: 'https://github.com/example/weather-app',
    createdAt: '2024-12-12',
    features: [
      'Current weather conditions',
      '7-day forecast with detailed information',
      'Location-based updates',
      'Beautiful weather visualizations',
      'Weather alerts and notifications',
      'Multiple location saving'
    ]
  },
  {
    id: '6',
    title: '3D Product Configurator',
    description: 'An interactive 3D product configurator for customizing products online.',
    longDescription: 'A cutting-edge 3D product configurator that allows users to customize products in real-time with immediate visual feedback. Built with React, Three.js, and react-three-fiber. Features include color selection, material changes, and component swapping with exportable configurations.',
    image: 'https://images.unsplash.com/photo-1626808642875-0aa545482dfb?q=80&w=1527&auto=format&fit=crop',
    tags: ['React', 'Three.js', 'WebGL'],
    category: '3D Visualization',
    isPremium: true,
    demoUrl: 'https://example.com/demo',
    createdAt: '2024-11-20',
    features: [
      'Interactive 3D model manipulation',
      'Real-time color and texture changes',
      'Component swapping and configuration',
      'High-quality rendering options',
      'Configuration saving and sharing',
      'Export options for manufactured products'
    ]
  }
];

export const categories = Array.from(new Set(projects.map(project => project.category)));

export const getAllTags = () => {
  const allTags = projects.flatMap(project => project.tags);
  return Array.from(new Set(allTags));
};
