import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wrench, Droplet, Zap, Wifi, X, Plus, Upload } from "lucide-react";
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
  { id: "other", label: "Other", icon: Plus, color: "text-muted-foreground" },
];

export default function ComplaintForm({ onClose, onSubmit }: ComplaintFormProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userId = localStorage.getItem('userId');
    if (!selectedCategory || !description || !location || !userId) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    const complaintData = {
      category: selectedCategory,
      description: description,
      location: location,
      roomNumber: roomNumber || undefined,
      userId: userId,
    };

    onSubmit(complaintData);

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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., 2nd Floor"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  data-testid="input-location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number (Optional)</Label>
                <Input
                  id="roomNumber"
                  placeholder="e.g., 201"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  data-testid="input-room-number"
                />
              </div>
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

            <div className="space-y-2">
              <Label htmlFor="file-upload">Attach File (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="flex-1"
                  data-testid="input-file"
                />
                {file && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {file && <p className="text-xs text-muted-foreground">Selected: {file.name}</p>}
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
