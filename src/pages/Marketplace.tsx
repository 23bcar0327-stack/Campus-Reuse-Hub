import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
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

const Marketplace = () => {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (!error) {
      setCategories(data || []);
    }
  }, []);

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

    if (!error) {
      setItems(data || []);
    }
  }, []);

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
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Browse all available items</p>
          </div>

          <div className="mb-8 space-y-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No items found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Marketplace;
