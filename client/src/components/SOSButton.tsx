import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SOSButton() {
  const [isPulsing, setIsPulsing] = useState(true);
  const { toast } = useToast();
  const userId = localStorage.getItem('userId') || '';
  const userName = localStorage.getItem('username') || 'User';

  const createSOSMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/sos-alerts", {
        userId,
        userName,
        roomNumber: localStorage.getItem('roomNumber') || null,
        location: "Emergency Alert",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sos-alerts"] });
      toast({
        title: "🚨 SOS Alert Sent!",
        description: "Help is on the way. Stay safe!",
        variant: "destructive",
      });
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
    createSOSMutation.mutate();
  };

  return (
    <Button
      onClick={handleSOS}
      data-testid="button-sos"
      size="icon"
      disabled={createSOSMutation.isPending}
      className={`fixed bottom-20 right-4 w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90 shadow-xl z-50 ${
        isPulsing ? 'animate-pulse' : ''
      }`}
    >
      <Bell className="w-8 h-8 text-destructive-foreground" />
    </Button>
  );
}
