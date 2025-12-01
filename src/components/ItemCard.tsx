import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Recycle, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPriceINR } from "@/lib/utils";

interface ItemCardProps {
  id: string;
  title: string;
  price: number;
  isDonation: boolean;
  images: string[];
  category: string;
  sellerName: string;
  createdAt: string;
}

export const ItemCard = ({
  id,
  title,
  price,
  isDonation,
  images,
  category,
  sellerName,
  createdAt,
}: ItemCardProps) => {
  const imageUrl = images && images.length > 0 ? images[0] : "/placeholder.svg";
  
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/item/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {isDonation && (
            <Badge className="absolute top-3 right-3 bg-accent">
              <Recycle className="mr-1 h-3 w-3" />
              Free
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-3 sm:p-4">
        <Link to={`/item/${id}`}>
          <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
          <span className="text-xl sm:text-2xl font-bold text-primary">
            {isDonation ? "FREE" : formatPriceINR(price)}
          </span>
          <Badge variant="secondary" className="text-xs sm:text-sm">{category}</Badge>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground truncate">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">Posted by {sellerName}</span>
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button asChild className="w-full" size="sm">
          <Link to={`/item/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
