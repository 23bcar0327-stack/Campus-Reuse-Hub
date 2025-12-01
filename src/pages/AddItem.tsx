import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Category {
  id: string;
  name: string;
  icon: string;
}

const AddItem = () => {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    is_donation: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }
    
    setUser(session.user);
  }, [navigate]);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (!error) {
      setCategories(data || []);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    fetchCategories();
  }, [checkAuth, fetchCategories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('item-images')
      .upload(fileName, file);

    if (uploadError) {
      toast({
        title: "Error uploading image",
        description: uploadError.message,
        variant: "destructive",
      });
      return null;
    }

    const { data } = supabase.storage
      .from('item-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.title || !formData.description || !formData.category_id) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const imageUrls: string[] = [];
    
    if (imageFile) {
      const url = await uploadImage(imageFile);
      if (url) {
        imageUrls.push(url);
      }
    }

    const { error } = await supabase
      .from("items")
      .insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        price: formData.is_donation ? 0 : parseFloat(formData.price) || 0,
        category_id: formData.category_id,
        is_donation: formData.is_donation,
        images: imageUrls,
        status: 'available',
      });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error creating listing",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Item listed successfully!",
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
        <div className="mb-6 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">List Your Item</h1>
        </div>
        
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl">Share Your Item</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Share what you no longer need with the campus community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm sm:text-base">Item Image</Label>
                <div className="flex items-center gap-4">
                  <label 
                    htmlFor="image" 
                    className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-2 text-center">
                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 mb-2 text-muted-foreground" />
                        <p className="text-xs sm:text-sm text-muted-foreground">Click to upload image</p>
                      </div>
                    )}
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm sm:text-base">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Calculus Textbook"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="text-sm sm:text-base"                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm sm:text-base">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the item's condition, features, etc."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="text-sm sm:text-base"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm sm:text-base">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Donation Toggle */}
              <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="donation" className="text-sm sm:text-base">Free Item (Donation)</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Toggle if giving away for free
                  </p>
                </div>
                <Switch
                  id="donation"
                  checked={formData.is_donation}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_donation: checked })}
                />
              </div>

              {/* Price (only if not donation) */}
              {!formData.is_donation && (
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm sm:text-base">Price in INR (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter price in ₹"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="text-sm sm:text-base"
                  />
                </div>
              )}

              <div className="flex gap-2 sm:gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/dashboard")} 
                  className="flex-1 text-sm sm:text-base h-10 sm:h-11"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="flex-1 text-sm sm:text-base h-10 sm:h-11"
                >
                  {isLoading ? "Creating..." : "List Item"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddItem;
