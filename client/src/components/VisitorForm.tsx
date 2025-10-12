import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, User, Phone, FileText, Home, IdCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VisitorFormProps {
  onClose: () => void;
  onSubmit: (visitor: any) => void;
}

export default function VisitorForm({ onClose, onSubmit }: VisitorFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [studentName, setStudentName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const { toast } = useToast();
  const userId = localStorage.getItem('userId') || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !purpose || !studentName || !roomNumber) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      name,
      phone,
      purpose,
      studentId: userId,
      studentName,
      roomNumber,
    });

    toast({
      title: "Success",
      description: "Visitor registered successfully"
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-visible max-h-[90vh] overflow-y-auto">
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

            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="studentName"
                  placeholder="Name of student to visit"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  data-testid="input-student-name"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number</Label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="roomNumber"
                  placeholder="e.g., 201"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  data-testid="input-room-number"
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
