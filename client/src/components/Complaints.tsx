import { Plus, Wrench, Droplet, Zap, Wifi, Clock, CheckCircle, XCircle, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import ComplaintForm from "./ComplaintForm";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Complaint } from "@shared/schema";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categoryConfig = {
  maintenance: { icon: Wrench, color: "text-chart-2" },
  plumbing: { icon: Droplet, color: "text-chart-5" },
  electrical: { icon: Zap, color: "text-warning" },
  internet: { icon: Wifi, color: "text-primary" },
  other: { icon: Plus, color: "text-muted-foreground" },
};

const statusConfig = {
  pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Pending" },
  "in-progress": { icon: Clock, color: "text-primary", bg: "bg-primary/10", label: "In Progress" },
  resolved: { icon: CheckCircle, color: "text-chart-3", bg: "bg-chart-3/10", label: "Resolved" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Rejected" },
};

export default function Complaints() {
  const [showForm, setShowForm] = useState(false);
  const userId = localStorage.getItem('userId') || '';

  const { data: complaints = [], isLoading } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints"],
  });

  const createComplaintMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/complaints", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/complaints"] });
      setShowForm(false);
    },
  });

  const deleteComplaintMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/complaints/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/complaints"] });
    },
  });

  const handleSubmitComplaint = (newComplaint: any) => {
    createComplaintMutation.mutate(newComplaint);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-bold">Complaints</h1>
            <p className="text-sm opacity-90">Track and submit issues</p>
          </div>
          <div>
            <ProfileMenu />
          </div>
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
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No complaints submitted yet</p>
            </div>
          ) : (
            complaints.map((complaint) => {
              const category = complaint.category as keyof typeof categoryConfig;
              const status = complaint.status as keyof typeof statusConfig;
              const CategoryIcon = categoryConfig[category]?.icon || Wrench;
              const StatusIcon = statusConfig[status]?.icon || Clock;
              const statusConf = statusConfig[status] || statusConfig.pending;
              
              return (
                <Card
                  key={complaint.id}
                  data-testid={`complaint-card-${complaint.id}`}
                  className="hover-elevate active-elevate-2 overflow-visible"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryConfig[category]?.color || 'text-chart-2'} bg-current/10`}>
                          <CategoryIcon className={`w-5 h-5 ${categoryConfig[category]?.color || 'text-chart-2'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium capitalize">{category}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(complaint.createdAt), "dd MMM yyyy, hh:mm a")}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteComplaintMutation.mutate(complaint.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{complaint.description}</p>
                    
                    {complaint.roomNumber && (
                      <p className="text-xs text-muted-foreground mb-3">
                        Room: {complaint.roomNumber}
                      </p>
                    )}

                    {complaint.attachmentUrl && (
                      <a 
                        href={complaint.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium hover:underline mb-3 block"
                      >
                        View Attachment
                      </a>
                    )}

                    <Badge className={`${statusConf.bg} ${statusConf.color} gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConf.label}
                    </Badge>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
