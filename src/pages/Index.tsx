import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ItemCard } from "@/components/ItemCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category_id: string;
  is_donation: boolean;
  status: string;
  images: string[];
  created_at: string;
  user?: { full_name: string };
  category?: { name: string };
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setIsAuthReady(true);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthReady(true);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      toast({
        title: "Error fetching categories",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setCategories(data || []);
    }
  }, [toast]);

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from("items")
      .select(`
        *,
        user:profiles(full_name),
        category:categories(name)
      `)
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching items",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setItems(data || []);
    }
  }, [toast]);

  const filterItems = useCallback(() => {
    let filtered = [...items];

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category_id === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [items, selectedCategory, searchQuery]);

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, [fetchCategories, fetchItems]);

  useEffect(() => {
    filterItems();
  }, [filterItems]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <Hero />

      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Search and Filter */}
            <div className="mb-4 sm:mb-6 md:mb-8 space-y-3 sm:space-y-4 md:space-y-6">
             <div className="relative w-full max-w-2xl">
               <Search className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9 sm:pl-10 text-xs sm:text-sm md:text-base h-9 sm:h-10"
              />
            </div>

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                isDonation={item.is_donation}
                images={item.images || []}
                category={item.category?.name || "Other"}
                sellerName={item.user?.full_name || "Anonymous"}
                createdAt={item.created_at}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground">No items found. Be the first to post!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
