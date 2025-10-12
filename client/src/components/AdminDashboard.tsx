import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { Users, Bed, MessageSquare, Utensils, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Analytics {
  complaints: {
    total: number;
    pending: number;
    resolved: number;
    byCategory: Record<string, number>;
  };
  rooms: {
    total: number;
    available: number;
    full: number;
    maintenance: number;
    occupancyRate: string;
  };
  mess: {
    totalFeedback: number;
    avgQuality: string;
    avgTaste: string;
    wastageReports: number;
  };
  sos: {
    total: number;
    active: number;
    resolved: number;
  };
  visitors: {
    total: number;
    active: number;
    checkedOut: number;
  };
}

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const stats = [
    { icon: Bed, label: "Room Occupancy", value: `${analytics.rooms.occupancyRate}%`, color: "text-chart-3" },
    { icon: MessageSquare, label: "Active Complaints", value: analytics.complaints.pending.toString(), color: "text-warning" },
    { icon: Utensils, label: "Avg. Mess Quality", value: analytics.mess.avgQuality, color: "text-chart-2" },
    { icon: Bell, label: "Active SOS", value: analytics.sos.active.toString(), color: "text-destructive" },
  ];

  const complaintData = Object.entries(analytics.complaints.byCategory).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 sticky top-0 z-30 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-sm opacity-90">Analytics & Reports</p>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="overflow-visible">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color} bg-current/10`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="overflow-visible">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Complaints by Category</h3>
            {complaintData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={complaintData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }} 
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-muted-foreground">No complaints data available</p>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="overflow-visible">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Room Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Rooms</span>
                  <span className="font-semibold">{analytics.rooms.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available</span>
                  <span className="font-semibold text-chart-3">{analytics.rooms.available}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Full</span>
                  <span className="font-semibold">{analytics.rooms.full}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Maintenance</span>
                  <span className="font-semibold text-warning">{analytics.rooms.maintenance}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="overflow-visible">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Mess Feedback</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Feedback</span>
                  <span className="font-semibold">{analytics.mess.totalFeedback}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Quality</span>
                  <span className="font-semibold text-chart-3">{analytics.mess.avgQuality}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Taste</span>
                  <span className="font-semibold text-chart-3">{analytics.mess.avgTaste}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Wastage Reports</span>
                  <span className="font-semibold text-destructive">{analytics.mess.wastageReports}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="overflow-visible">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Visitor Management</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Visitors</span>
                <span className="font-semibold">{analytics.visitors.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Currently Active</span>
                <span className="font-semibold text-chart-3">{analytics.visitors.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Checked Out</span>
                <span className="font-semibold">{analytics.visitors.checkedOut}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
