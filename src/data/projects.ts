
// This file is kept for TypeScript interfaces only.
// Actual project data is now fetched from Supabase.

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

// Get all unique categories (now done from database)
export const getAllTags = () => {
  return [];
};
