import { Plus, Search, MapPin, Clock, Tag, X, MoreVertical, Trash2, CheckCircle, Paperclip } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { LostFound } from "@shared/schema";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [attachment, setAttachment] = useState<File | null>(null);
  const { toast } = useToast();
  const userId = localStorage.getItem('userId') || '';
  const userName = localStorage.getItem('username') || 'User';

  const { data: items = [], isLoading } = useQuery<LostFound[]>({
    queryKey: ["/api/lost-found"],
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/lost-found', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create item');
      }
      return response.json();
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
      setAttachment(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to report item",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/lost-found/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lost-found"] });
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/lost-found/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lost-found"] });
      toast({
        title: "Success",
        description: "Item status updated",
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

    const formData = new FormData();
    formData.append("type", type);
    formData.append("itemName", itemName);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("category", category);
    formData.append("reportedBy", userId);
    formData.append("reporterName", userName);
    formData.append("contactInfo", contactInfo);
    if (attachment) {
      formData.append("attachment", attachment);
    }

    createItemMutation.mutate(formData);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-bold">Lost & Found</h1>
            <p className="text-sm opacity-90">Report and find items</p>
          </div>
          <div>
            <ProfileMenu />
          </div>
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

                  <div className="space-y-2">
                    <Label htmlFor="attachment">Attachment (Photo/Video)</Label>
                    <Input
                      id="attachment"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                      data-testid="input-attachment"
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
                className="overflow-visible"
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
                    <div className="flex items-center gap-2">
                      <Badge className={item.type === "lost" ? "bg-destructive/10 text-destructive" : "bg-chart-3/10 text-chart-3"}>
                        {item.type === "lost" ? "Lost" : "Found"}
                      </Badge>
                      {item.reportedBy === userId && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteItemMutation.mutate(item.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground border-t pt-3 mt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Contact:</span>
                      <span>{item.contactInfo}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div>
                      {item.attachmentUrl && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="link" className="p-0 h-auto text-sm">
                              <Paperclip className="w-4 h-4 mr-2" />
                              View Attachment
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>{item.itemName} Attachment</DialogTitle>
                            </DialogHeader>
                            {item.attachmentUrl.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                              <img src={item.attachmentUrl} alt={item.itemName} className="max-w-full h-auto rounded-md" />
                            ) : (
                              <video src={item.attachmentUrl} controls className="max-w-full h-auto rounded-md" />
                            )}
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    <div className="flex justify-end">
                      {item.status === 'active' ? (
                        <Button 
                          size="sm" 
                          onClick={() => {
                            const payload: { id: string; status: string; type?: 'found' } = { id: item.id, status: 'resolved' };
                            if (item.type === 'lost') {
                              payload.type = 'found';
                            }
                            updateStatusMutation.mutate(payload);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Resolved
                        </Button>
                      ) : (
                        <Badge className="bg-chart-3/10 text-chart-3">
                          Resolved
                        </Badge>
                      )}
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
