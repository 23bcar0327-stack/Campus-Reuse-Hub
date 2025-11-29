import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Recycle, Leaf, Users } from "lucide-react";
import heroImage from "@/assets/hero-campus.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Students sharing and exchanging items on campus" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Buy, Sell & Share
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Sustainably on Campus
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join your campus community in promoting sustainability. Find great deals on pre-owned items 
            or give your unused stuff a second life.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Button asChild size="lg" className="text-lg">
              <Link to="/marketplace">Browse Items</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link to="/auth">Join Now</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Recycle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Eco-Friendly</h3>
                <p className="text-sm text-muted-foreground">Reduce waste, reuse items</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-secondary/10 p-2">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Campus Community</h3>
                <p className="text-sm text-muted-foreground">Connect with students</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <Leaf className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Save Money</h3>
                <p className="text-sm text-muted-foreground">Great deals on quality items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
