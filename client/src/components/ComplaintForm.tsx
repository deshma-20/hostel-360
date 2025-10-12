import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wrench, Droplet, Zap, Wifi, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComplaintFormProps {
  onClose: () => void;
  onSubmit: (complaint: any) => void;
}

const categories = [
  { id: "maintenance", label: "Maintenance", icon: Wrench, color: "text-chart-2" },
  { id: "plumbing", label: "Plumbing", icon: Droplet, color: "text-chart-5" },
  { id: "electrical", label: "Electrical", icon: Zap, color: "text-warning" },
  { id: "internet", label: "Internet", icon: Wifi, color: "text-primary" },
];

export default function ComplaintForm({ onClose, onSubmit }: ComplaintFormProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory || !description || !location) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      category: selectedCategory,
      description,
      location,
      status: "pending",
      date: "Just now"
    });

    toast({
      title: "Success",
      description: "Complaint submitted successfully"
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-visible">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Submit Complaint</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              data-testid="button-close-complaint"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    className="gap-2 justify-start"
                    data-testid={`button-category-${cat.id}`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Room 201, Common Room"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                data-testid="input-location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                data-testid="input-description"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                data-testid="button-submit-complaint"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
