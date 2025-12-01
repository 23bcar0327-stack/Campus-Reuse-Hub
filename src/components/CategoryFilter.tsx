import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Laptop, 
  Shirt, 
  Armchair, 
  Dumbbell, 
  Recycle,
  Grid3x3,
  type LucideIcon
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const iconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "laptop": Laptop,
  "shirt": Shirt,
  "armchair": Armchair,
  "dumbbell": Dumbbell,
  "recycle": Recycle,
};

export const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) => {
  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex flex-wrap gap-2 sm:gap-3 min-w-min sm:min-w-0">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onSelectCategory(null)}
          className="gap-2 flex-shrink-0 text-xs sm:text-sm"
          size="sm"
        >
          <Grid3x3 className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">All Items</span>
          <span className="inline xs:hidden">All</span>
        </Button>
        
        {categories.map((category) => {
          const Icon = iconMap[category.icon || "grid-3x3"];
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => onSelectCategory(category.id)}
              className="gap-2 flex-shrink-0 text-xs sm:text-sm"
              size="sm"
            >
              {Icon && <Icon className="h-3 w-3 sm:h-4 sm:w-4" />}
              <span className="hidden xs:inline">{category.name}</span>
              <span className="inline xs:hidden">{category.name.substring(0, 3)}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
