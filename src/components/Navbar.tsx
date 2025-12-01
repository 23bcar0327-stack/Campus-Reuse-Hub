import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Recycle, User, LogOut, Plus, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import type { User as AuthUser } from "@supabase/supabase-js";

interface NavbarProps {
  user: AuthUser | null;
}

export const Navbar = ({ user }: NavbarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
    });
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 flex-shrink-0">
            <Recycle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="hidden sm:inline text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Campus Reuse Hub
            </span>
            <span className="sm:hidden text-sm font-bold text-primary">Reuse Hub</span>
          </Link>

          {/* Mobile Menu Button */}
          {isMobile ? (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          ) : (
            /* Desktop Navigation */
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <>
                  <Button asChild variant="default" size="sm">
                    <Link to="/add-item" onClick={handleNavigation}>
                      <Plus className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Add Item</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/dashboard" onClick={handleNavigation}>
                      <User className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                  </Button>
                  <Button onClick={handleLogout} variant="ghost" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/auth">Login</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="pb-4 space-y-2 border-t">
            {user ? (
              <>
                <Button asChild variant="default" className="w-full justify-start">
                  <Link to="/add-item" onClick={handleNavigation}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/dashboard" onClick={handleNavigation}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth" onClick={handleNavigation}>Login</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/auth" onClick={handleNavigation}>Get Started</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
