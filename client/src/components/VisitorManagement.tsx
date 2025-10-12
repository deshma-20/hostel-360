import { Plus, User, Phone, Clock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import VisitorForm from "./VisitorForm";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Visitor } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function VisitorManagement() {
  const [showForm, setShowForm] = useState(false);

  const { data: visitors = [], isLoading } = useQuery<Visitor[]>({
    queryKey: ["/api/visitors"],
  });

  const createVisitorMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/visitors", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/visitors"] });
    },
  });

  const checkoutVisitorMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("PATCH", `/api/visitors/${id}`, {
        status: "checked-out",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/visitors"] });
    },
  });

  const handleAddVisitor = (newVisitor: any) => {
    createVisitorMutation.mutate(newVisitor);
  };

  const handleCheckout = (visitorId: string) => {
    checkoutVisitorMutation.mutate(visitorId);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 sticky top-0 z-30 shadow-lg">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold">Visitor Management</h1>
          <p className="text-sm opacity-90">Register & track visitors</p>
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto">
        <Button
          data-testid="button-new-visitor"
          className="w-full mb-4 gap-2"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-5 h-5" />
          Register New Visitor
        </Button>

        {showForm && (
          <VisitorForm
            onClose={() => setShowForm(false)}
            onSubmit={handleAddVisitor}
          />
        )}

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading visitors...</p>
            </div>
          ) : visitors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No visitors registered yet</p>
            </div>
          ) : (
            visitors.map((visitor) => (
              <Card
                key={visitor.id}
                data-testid={`visitor-card-${visitor.id}`}
                className="hover-elevate active-elevate-2 cursor-pointer overflow-visible"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{visitor.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3" />
                          {visitor.phone}
                        </p>
                      </div>
                    </div>
                    <Badge className={visitor.status === "checked-in" ? "bg-chart-3/10 text-chart-3" : "bg-muted text-muted-foreground"}>
                      {visitor.status === "checked-in" ? "Active" : "Completed"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium">Purpose:</span>
                      <span>{visitor.purpose}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium">Meeting:</span>
                      <span>{visitor.studentName} (Room {visitor.roomNumber})</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>In: {formatDistanceToNow(new Date(visitor.checkIn), { addSuffix: true })}</span>
                      {visitor.checkOut && (
                        <span>• Out: {formatDistanceToNow(new Date(visitor.checkOut), { addSuffix: true })}</span>
                      )}
                    </div>
                  </div>

                  {visitor.status === "checked-in" && (
                    <Button
                      onClick={() => handleCheckout(visitor.id)}
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 gap-2"
                      data-testid={`button-checkout-${visitor.id}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Check Out
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
