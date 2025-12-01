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
    <div className="flex flex-wrap gap-3">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onSelectCategory(null)}
        className="gap-2"
      >
        <Grid3x3 className="h-4 w-4" />
        All Items
      </Button>
      
      {categories.map((category) => {
        const Icon = iconMap[category.icon || "grid-3x3"];
        return (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => onSelectCategory(category.id)}
            className="gap-2"
          >
            {Icon && <Icon className="h-4 w-4" />}
            {category.name}
          </Button>
        );
      })}
    </div>
  );
};
