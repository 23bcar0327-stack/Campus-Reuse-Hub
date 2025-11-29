import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { convertUSDtoINR } from "@/lib/utils";
import { ArrowLeft, Recycle, Mail, User, Calendar } from "lucide-react";
import type { User as AuthUser } from "@supabase/supabase-js";

interface ItemData {
  id: string;
  title: string;
  description: string;
  price: number;
  category_id: string;
  is_donation: boolean;
  status: string;
  images: string[];
  created_at: string;
  user_id: string;
  category?: { name: string };
  user?: { full_name: string; email: string };
}

interface SellerData {
  full_name: string;
  email: string;
}

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [item, setItem] = useState<ItemData | null>(null);
  const [seller, setSeller] = useState<SellerData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  }, []);

  const fetchItemDetails = useCallback(async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("items")
      .select(`
        *,
        category:categories(name),
        user:profiles(*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "Error loading item",
        description: error.message,
        variant: "destructive",
      });
      navigate("/");
    } else {
      setItem(data);
      setSeller(data.user);
    }
    
    setLoading(false);
  }, [id, navigate, toast]);

  useEffect(() => {
    checkAuth();
    fetchItemDetails();
  }, [checkAuth, fetchItemDetails]);

  const handleContactSeller = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to contact sellers",
      });
      navigate("/auth");
      return;
    }

    if (seller?.email) {
      // Open Gmail compose with prewritten subject and body
      const subject = `Interested in: ${item?.title}`;
      const body = `Hi ${seller?.full_name || "Seller"},\n\nI am interested in your item "${item?.title}" listed on Campus Giveaway Spot.\n\nPlease let me know more details or the best way to proceed.\n\nThank you!\n\nBest regards,\n${user?.user_metadata?.full_name || user?.email}`;
      
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${seller.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <div className="container mx-auto px-4 py-8">
          <p>Item not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={item.images?.[0] || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{item.title}</h1>
                {item.is_donation && (
                  <Badge className="bg-accent">
                    <Recycle className="mr-1 h-3 w-3" />
                    Free
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-primary">
                  {item.is_donation ? "FREE" : convertUSDtoINR(parseFloat(item.price))}
                </span>
                <Badge variant="secondary">{item.category?.name}</Badge>
                <Badge variant={item.status === 'available' ? 'default' : 'outline'}>
                  {item.status}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>

            <Separator />

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Seller Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{seller?.full_name || "Anonymous"}</span>
                  </div>
                  {seller?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{seller.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Posted {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {item.status === 'available' && (
                  <Button 
                    onClick={handleContactSeller}
                    className="w-full mt-6"
                    size="lg"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Seller
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
