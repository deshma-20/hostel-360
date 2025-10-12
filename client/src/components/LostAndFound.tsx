import { Plus, Search, MapPin, Clock, Tag, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { LostFound } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const categories = ["Electronics", "Wallet", "Bottle", "Stationery", "Keys", "Bag", "Others"];

export default function LostAndFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<"lost" | "found">("lost");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const { toast } = useToast();
  const userId = localStorage.getItem('userId') || '';
  const userName = localStorage.getItem('username') || 'User';

  const { data: items = [], isLoading } = useQuery<LostFound[]>({
    queryKey: ["/api/lost-found"],
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/lost-found", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lost-found"] });
      toast({
        title: "Success",
        description: "Item reported successfully",
      });
      setShowForm(false);
      setItemName("");
      setDescription("");
      setLocation("");
      setCategory("");
      setContactInfo("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to report item",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemName || !description || !location || !category || !contactInfo) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    createItemMutation.mutate({
      type,
      itemName,
      description,
      location,
      category,
      reportedBy: userId,
      reporterName: userName,
      contactInfo,
    });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || item.type === filter;
    return matchesSearch && matchesFilter && item.status === "active";
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 sticky top-0 z-30 shadow-lg">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold">Lost & Found</h1>
          <p className="text-sm opacity-90">Report and find items</p>
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search"
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            data-testid="filter-all"
            className="flex-1"
          >
            All
          </Button>
          <Button
            onClick={() => setFilter("lost")}
            variant={filter === "lost" ? "default" : "outline"}
            size="sm"
            data-testid="filter-lost"
            className="flex-1"
          >
            Lost
          </Button>
          <Button
            onClick={() => setFilter("found")}
            variant={filter === "found" ? "default" : "outline"}
            size="sm"
            data-testid="filter-found"
            className="flex-1"
          >
            Found
          </Button>
        </div>

        <Button
          data-testid="button-report-item"
          className="w-full gap-2"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-5 h-5" />
          Report Item
        </Button>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md overflow-visible max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Report Item</h2>
                  <Button
                    onClick={() => setShowForm(false)}
                    variant="ghost"
                    size="icon"
                    data-testid="button-close-form"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => setType("lost")}
                        variant={type === "lost" ? "destructive" : "outline"}
                        className="flex-1"
                        data-testid="button-type-lost"
                      >
                        Lost
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setType("found")}
                        variant={type === "found" ? "default" : "outline"}
                        className="flex-1"
                        data-testid="button-type-found"
                      >
                        Found
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="itemName">Item Name</Label>
                    <Input
                      id="itemName"
                      placeholder="e.g., Blue Water Bottle"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      data-testid="input-item-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => (
                        <Button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          variant={category === cat ? "default" : "outline"}
                          size="sm"
                          data-testid={`button-category-${cat.toLowerCase()}`}
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the item..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      data-testid="input-description"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Where was it lost/found?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      data-testid="input-location"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactInfo">Contact Info</Label>
                    <Input
                      id="contactInfo"
                      placeholder="Phone or email"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      data-testid="input-contact"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => setShowForm(false)}
                      variant="outline"
                      className="flex-1"
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      data-testid="button-submit"
                      disabled={createItemMutation.isPending}
                    >
                      {createItemMutation.isPending ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No items found</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card
                key={item.id}
                data-testid={`item-card-${item.id}`}
                className="hover-elevate active-elevate-2 cursor-pointer overflow-visible"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{item.itemName}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Tag className="w-4 h-4" />
                        <span>{item.category}</span>
                      </div>
                    </div>
                    <Badge className={item.type === "lost" ? "bg-destructive/10 text-destructive" : "bg-chart-3/10 text-chart-3"}>
                      {item.type === "lost" ? "Lost" : "Found"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Contact:</span>
                      <span>{item.contactInfo}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
