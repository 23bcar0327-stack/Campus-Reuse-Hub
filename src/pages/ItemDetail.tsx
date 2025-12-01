import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatPriceINR } from "@/lib/utils";
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
      const subject = `Interested in: ${item?.title}`;
      const body = `Hi ${seller?.full_name || "Seller"},\n\nI am interested in your item "${item?.title}" listed on Campus Reuse Hub.\n\nPlease let me know more details or the best way to proceed.\n\nThank you!\n\nBest regards,\n${user?.user_metadata?.full_name || user?.email}`;
      
      // Try Gmail first
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(seller.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const gmailWindow = window.open(gmailUrl, "_blank");
      
      // Fallback to mailto if Gmail doesn't work (user doesn't have Gmail open or JS blocked)
      if (!gmailWindow || gmailWindow.closed) {
        const mailtoUrl = `mailto:${encodeURIComponent(seller.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
      }
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
      
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-4 sm:mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold">{item.title}</h1>
                {item.is_donation && (
                  <Badge className="bg-accent flex-shrink-0">
                    <Recycle className="mr-1 h-3 w-3" />
                    Free
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  {item.is_donation ? "FREE" : formatPriceINR(parseFloat(item.price))}
                </span>
                <Badge variant="secondary" className="text-xs sm:text-sm">{item.category?.name}</Badge>
                <Badge variant={item.status === 'available' ? 'default' : 'outline'} className="text-xs sm:text-sm">
                  {item.status}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Description</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>

            <Separator />

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold mb-4 text-base sm:text-lg">Seller Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm sm:text-base">{seller?.full_name || "Anonymous"}</span>
                  </div>
                  {seller?.email && (
                    <div className="flex items-center gap-2 break-all">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground">{seller.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground">
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
