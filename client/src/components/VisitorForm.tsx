import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, User, Phone, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VisitorFormProps {
  onClose: () => void;
  onSubmit: (visitor: any) => void;
}

export default function VisitorForm({ onClose, onSubmit }: VisitorFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !purpose) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    const now = new Date();
    const checkInTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    onSubmit({
      name,
      phone,
      purpose,
      checkIn: checkInTime,
      status: "active"
    });

    toast({
      title: "Success",
      description: "Visitor registered successfully"
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-visible">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Register Visitor</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              data-testid="button-close-visitor"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Visitor Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="input-visitor-name"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-testid="input-visitor-phone"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Visit</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="purpose"
                  placeholder="e.g., Parent Visit, Delivery"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  data-testid="input-visitor-purpose"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
                data-testid="button-cancel-visitor"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                data-testid="button-submit-visitor"
              >
                Register
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
