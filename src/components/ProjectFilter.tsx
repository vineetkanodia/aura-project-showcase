
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectFilterProps {
  categories: string[];
  onFilterChange: (filters: {
    search: string;
    categories: string[];
    premiumOnly: boolean;
    freeOnly: boolean;
  }) => void;
}

const ProjectFilter = ({ categories, onFilterChange }: ProjectFilterProps) => {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);

  useEffect(() => {
    onFilterChange({
      search,
      categories: selectedCategories,
      premiumOnly,
      freeOnly,
    });
  }, [search, selectedCategories, premiumOnly, freeOnly, onFilterChange]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePremiumToggle = () => {
    setPremiumOnly(prev => !prev);
    if (!premiumOnly) setFreeOnly(false);
  };

  const handleFreeToggle = () => {
    setFreeOnly(prev => !prev);
    if (!freeOnly) setPremiumOnly(false);
  };

  const handleClear = () => {
    setSearch('');
    setSelectedCategories([]);
    setPremiumOnly(false);
    setFreeOnly(false);
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="Search projects..."
              className="pl-10 bg-secondary/50 border-white/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white/10 flex gap-2">
                  <Filter size={16} />
                  <span>Categories</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-secondary w-56">
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white/10">
                  Access
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-secondary w-56">
                <DropdownMenuCheckboxItem
                  checked={freeOnly}
                  onCheckedChange={handleFreeToggle}
                >
                  Free Only
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={premiumOnly}
                  onCheckedChange={handlePremiumToggle}
                >
                  Premium Only
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {(search || selectedCategories.length > 0 || premiumOnly || freeOnly) && (
              <Button variant="ghost" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilter;
