import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card } from "@/components/ui/card";
import { Users, Bed, MessageSquare, Utensils } from "lucide-react";

const complaintData = [
  { name: "Mon", count: 12 },
  { name: "Tue", count: 19 },
  { name: "Wed", count: 8 },
  { name: "Thu", count: 15 },
  { name: "Fri", count: 22 },
  { name: "Sat", count: 10 },
  { name: "Sun", count: 6 },
];

const occupancyData = [
  { name: "Occupied", value: 156, color: "hsl(var(--primary))" },
  { name: "Vacant", value: 44, color: "hsl(var(--muted))" },
];

const messRatings = [
  { name: "5 Star", value: 45, color: "hsl(140 70% 45%)" },
  { name: "4 Star", value: 30, color: "hsl(var(--chart-3))" },
  { name: "3 Star", value: 15, color: "hsl(var(--warning))" },
  { name: "2 Star", value: 7, color: "hsl(var(--chart-4))" },
  { name: "1 Star", value: 3, color: "hsl(var(--destructive))" },
];

export default function AdminDashboard() {
  const stats = [
    { icon: Users, label: "Total Students", value: "342", color: "text-primary" },
    { icon: Bed, label: "Rooms Occupied", value: "156/200", color: "text-chart-3" },
    { icon: MessageSquare, label: "Active Complaints", value: "23", color: "text-warning" },
    { icon: Utensils, label: "Avg. Mess Rating", value: "4.2", color: "text-chart-2" },
  ];

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
            <h3 className="font-semibold mb-4">Complaints This Week</h3>
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
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="overflow-visible">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Room Occupancy</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2 text-sm">
                {occupancyData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-muted-foreground">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="overflow-visible">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Mess Feedback Distribution</h3>
              <div className="space-y-2">
                {messRatings.map((rating) => (
                  <div key={rating.name} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-16">{rating.name}</span>
                    <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                      <div 
                        className="h-full flex items-center justify-end pr-2 text-xs text-white font-medium transition-all"
                        style={{ 
                          width: `${rating.value}%`, 
                          backgroundColor: rating.color 
                        }}
                      >
                        {rating.value}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
