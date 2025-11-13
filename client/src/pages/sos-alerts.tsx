import { useQuery } from "@tanstack/react-query";
import { AlertCircle, User, Home, Building, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SOSAlert {
  id: number;
  userId: string;
  userName: string;
  roomNumber: string | null;
  location: string;
  createdAt: string;
  status: string;
}

export default function SOSAlerts() {
  const { data: alerts, isLoading } = useQuery<SOSAlert[]>({
    queryKey: ["/api/sos-alerts"],
  });

  const getEmergencyType = (location: string) => {
    if (location.includes('Medical')) return { type: 'Medical Emergency', icon: '🏥', color: 'bg-red-100 text-red-800' };
    if (location.includes('Fire')) return { type: 'Fire Alert', icon: '🔥', color: 'bg-orange-100 text-orange-800' };
    if (location.includes('Electrical')) return { type: 'Electrical Issue', icon: '⚡', color: 'bg-yellow-100 text-yellow-800' };
    return { type: 'Emergency', icon: '🚨', color: 'bg-red-100 text-red-800' };
  };

  const getBlockFromRoom = (roomNumber: string | null) => {
    if (!roomNumber || roomNumber === 'N/A') return 'Unknown';
    const roomNum = parseInt(roomNumber);
    return `Block ${Math.floor(roomNum / 100) + 1}`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-destructive to-red-700 text-white p-4 sticky top-0 z-30 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">SOS Emergency Alerts</h1>
              <p className="text-sm opacity-90">Monitor and respond to emergency situations</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading alerts...</p>
          </div>
        ) : !alerts || alerts.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No emergency alerts at this time. All clear! 🎉
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Active Alerts ({alerts.length})
              </h2>
              <Badge variant="destructive" className="animate-pulse">
                LIVE
              </Badge>
            </div>

            {alerts.map((alert) => {
              const emergencyInfo = getEmergencyType(alert.location);
              const alertDate = new Date(alert.createdAt);
              const formattedDate = alertDate.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });
              const formattedTime = alertDate.toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              });

              return (
                <Card key={alert.id} className="border-l-4 border-l-destructive shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{emergencyInfo.icon}</span>
                        <div>
                          <CardTitle className="text-destructive">
                            {emergencyInfo.type}
                          </CardTitle>
                          <Badge className={emergencyInfo.color + " mt-1"}>
                            {alert.status || 'ACTIVE'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* Student Information */}
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-semibold">Student:</span>
                        <span>{alert.userName}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Home className="w-4 h-4 text-primary" />
                        <span className="font-semibold">Room:</span>
                        <span>{alert.roomNumber || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4 text-primary" />
                        <span className="font-semibold">Block:</span>
                        <span>{getBlockFromRoom(alert.roomNumber)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-semibold">Date:</span>
                        <span>{formattedDate}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-semibold">Time:</span>
                        <span>{formattedTime}</span>
                      </div>
                    </div>

                    {/* Location/Description */}
                    <div className="bg-destructive/5 p-3 rounded-lg border border-destructive/20">
                      <p className="text-sm font-semibold text-destructive mb-1">Details:</p>
                      <p className="text-sm">{alert.location}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
