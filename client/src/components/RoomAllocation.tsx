import { Bed, Users, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Room } from "@shared/schema";

const statusConfig = {
  available: { icon: CheckCircle, color: "text-chart-3", bg: "bg-chart-3/10", label: "Available" },
  full: { icon: XCircle, color: "text-muted-foreground", bg: "bg-muted", label: "Full" },
  maintenance: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Maintenance" },
};

export default function RoomAllocation() {
  const { data: rooms = [], isLoading } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 sticky top-0 z-30 shadow-lg">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold">Room Allocation</h1>
          <p className="text-sm opacity-90">Manage room assignments</p>
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No rooms available</p>
          </div>
        ) : (
          rooms.map((room) => {
            const status = room.status as keyof typeof statusConfig;
            const config = statusConfig[status] || statusConfig.available;
            const StatusIcon = config.icon;
            
            return (
              <Card
                key={room.id}
                data-testid={`room-card-${room.id}`}
                className="hover-elevate active-elevate-2 cursor-pointer overflow-visible"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                        <Bed className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Room {room.number}</h3>
                        <p className="text-sm text-muted-foreground">Floor {room.floor}</p>
                      </div>
                    </div>
                    <Badge className={`${config.bg} ${config.color} gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {room.occupied}/{room.capacity} Occupied
                    </span>
                    <div className="flex-1 bg-muted rounded-full h-2 ml-2">
                      <div 
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
