import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SOSButtonProps {
  triggerOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function SOSButton({ triggerOpen, onOpenChange }: SOSButtonProps = {}) {
  const [isPulsing, setIsPulsing] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState("medical");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const userId = localStorage.getItem('userId') || '';
  const userName = localStorage.getItem('userName') || localStorage.getItem('username') || 'User';
  const roomNumber = localStorage.getItem('roomNumber') || 'N/A';

  // Sync with external trigger
  useEffect(() => {
    if (triggerOpen !== undefined) {
      setDialogOpen(triggerOpen);
    }
  }, [triggerOpen]);

  // Notify parent of state changes
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB');
  const formattedTime = currentDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const hostelBlock = roomNumber !== 'N/A' ? `Block ${Math.floor(parseInt(roomNumber) / 100) + 1}` : 'Unknown';

  const createSOSMutation = useMutation({
    mutationFn: async () => {
      const emergencyTypeText = emergencyType === 'medical' ? 'Medical Emergency' : 
                                emergencyType === 'fire' ? 'Fire Alert' :
                                emergencyType === 'electrical' ? 'Electrical Issue' : 'Other Emergency';
      
      return await apiRequest("POST", "/api/sos-alerts", {
        userId,
        userName,
        roomNumber: roomNumber !== 'N/A' ? roomNumber : null,
        location: `${hostelBlock} - ${emergencyTypeText}${description ? ': ' + description : ''}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sos-alerts"] });
      
      toast({
        title: "🚨 SOS Alert Sent!",
        description: `Emergency alert has been sent to hostel authorities. Help is on the way!`,
        variant: "destructive",
        duration: 5000,
      });
      
      handleDialogOpenChange(false);
      setEmergencyType("medical");
      setDescription("");
      setIsPulsing(false);
      setTimeout(() => setIsPulsing(true), 3000);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send SOS alert. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSOS = () => {
    handleDialogOpenChange(true);
  };

  const handleSendAlert = () => {
    createSOSMutation.mutate();
  };

  return (
    <>
      <Button
        onClick={handleSOS}
        data-testid="button-sos"
        size="icon"
        className={`fixed bottom-20 right-4 w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90 shadow-xl z-50 ${
          isPulsing ? 'animate-pulse' : ''
        }`}
      >
        <Bell className="w-8 h-8 text-destructive-foreground" />
      </Button>

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              🚨 SOS Emergency Alert
            </DialogTitle>
            <DialogDescription>
              Your alert will be sent immediately to hostel authorities
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Student Details */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm"><span className="font-semibold">Student:</span> {userName}</p>
              <p className="text-sm"><span className="font-semibold">Room:</span> {roomNumber}</p>
              <p className="text-sm"><span className="font-semibold">Block:</span> {hostelBlock}</p>
              <p className="text-sm"><span className="font-semibold">Date:</span> {formattedDate}</p>
              <p className="text-sm"><span className="font-semibold">Time:</span> {formattedTime}</p>
            </div>

            {/* Emergency Type Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Type of Emergency *</Label>
              <RadioGroup value={emergencyType} onValueChange={setEmergencyType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medical" id="medical" />
                  <Label htmlFor="medical" className="cursor-pointer">🏥 Medical Emergency</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fire" id="fire" />
                  <Label htmlFor="fire" className="cursor-pointer">🔥 Fire Alert</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="electrical" id="electrical" />
                  <Label htmlFor="electrical" className="cursor-pointer">⚡ Electrical Issue</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer">📝 Other</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Additional Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe the emergency situation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleDialogOpenChange(false)}
              disabled={createSOSMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSendAlert}
              disabled={createSOSMutation.isPending}
              className="gap-2"
            >
              <Bell className="w-4 h-4" />
              {createSOSMutation.isPending ? "Sending..." : "Send SOS Alert"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
