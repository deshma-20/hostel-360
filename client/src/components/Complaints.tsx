import { Plus, Wrench, Droplet, Zap, Wifi, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ComplaintForm from "./ComplaintForm";

interface Complaint {
  id: string;
  category: "maintenance" | "plumbing" | "electrical" | "internet";
  description: string;
  status: "pending" | "in-progress" | "resolved" | "rejected";
  date: string;
}

const mockComplaints: Complaint[] = [
  { id: "1", category: "electrical", description: "Fan not working in Room 201", status: "in-progress", date: "2 hours ago" },
  { id: "2", category: "plumbing", description: "Leaking tap in washroom", status: "pending", date: "5 hours ago" },
  { id: "3", category: "internet", description: "WiFi connection issue", status: "resolved", date: "1 day ago" },
];

const categoryConfig = {
  maintenance: { icon: Wrench, color: "text-chart-2" },
  plumbing: { icon: Droplet, color: "text-chart-5" },
  electrical: { icon: Zap, color: "text-warning" },
  internet: { icon: Wifi, color: "text-primary" },
};

const statusConfig = {
  pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Pending" },
  "in-progress": { icon: Clock, color: "text-primary", bg: "bg-primary/10", label: "In Progress" },
  resolved: { icon: CheckCircle, color: "text-chart-3", bg: "bg-chart-3/10", label: "Resolved" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Rejected" },
};

export default function Complaints() {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [showForm, setShowForm] = useState(false);

  const handleSubmitComplaint = (newComplaint: any) => {
    const complaint = {
      id: String(complaints.length + 1),
      ...newComplaint
    };
    setComplaints([complaint, ...complaints]);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 sticky top-0 z-30 shadow-lg">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold">Complaints</h1>
          <p className="text-sm opacity-90">Track and submit issues</p>
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto">
        <Button
          data-testid="button-new-complaint"
          className="w-full mb-4 gap-2"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-5 h-5" />
          Submit New Complaint
        </Button>

        {showForm && (
          <ComplaintForm
            onClose={() => setShowForm(false)}
            onSubmit={handleSubmitComplaint}
          />
        )}

        <div className="space-y-3">
          {complaints.map((complaint) => {
            const CategoryIcon = categoryConfig[complaint.category].icon;
            const StatusIcon = statusConfig[complaint.status].icon;
            const statusConf = statusConfig[complaint.status];
            
            return (
              <Card
                key={complaint.id}
                data-testid={`complaint-card-${complaint.id}`}
                className="hover-elevate active-elevate-2 cursor-pointer overflow-visible"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryConfig[complaint.category].color} bg-current/10`}>
                      <CategoryIcon className={`w-5 h-5 ${categoryConfig[complaint.category].color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{complaint.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{complaint.date}</p>
                    </div>
                  </div>
                  <Badge className={`${statusConf.bg} ${statusConf.color} gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConf.label}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
