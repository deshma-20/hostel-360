import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SOSButton() {
  const [isPulsing, setIsPulsing] = useState(true);

  const handleSOS = () => {
    console.log('🚨 SOS ALERT TRIGGERED!');
    setIsPulsing(false);
    setTimeout(() => setIsPulsing(true), 3000);
  };

  return (
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
  );
}
