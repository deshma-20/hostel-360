import { Plus, User, Phone, Clock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import VisitorForm from "./VisitorForm";

interface Visitor {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  checkIn: string;
  checkOut?: string;
  status: "active" | "completed";
}

const mockVisitors: Visitor[] = [
  { id: "1", name: "Rajesh Kumar", phone: "+91 98765 43210", purpose: "Parent Visit", checkIn: "10:30 AM", status: "active" },
  { id: "2", name: "Priya Singh", phone: "+91 98765 43211", purpose: "Friend", checkIn: "11:00 AM", checkOut: "2:30 PM", status: "completed" },
  { id: "3", name: "Amit Sharma", phone: "+91 98765 43212", purpose: "Delivery", checkIn: "12:15 PM", checkOut: "12:30 PM", status: "completed" },
];

export default function VisitorManagement() {
  const [visitors, setVisitors] = useState(mockVisitors);
  const [showForm, setShowForm] = useState(false);

  const handleAddVisitor = (newVisitor: any) => {
    const visitor = {
      id: String(visitors.length + 1),
      ...newVisitor
    };
    setVisitors([visitor, ...visitors]);
  };

  const handleCheckout = (visitorId: string) => {
    const now = new Date();
    const checkOutTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    setVisitors(visitors.map(v => 
      v.id === visitorId 
        ? { ...v, checkOut: checkOutTime, status: "completed" as const }
        : v
    ));
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
          {visitors.map((visitor) => (
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
                  <Badge className={visitor.status === "active" ? "bg-chart-3/10 text-chart-3" : "bg-muted text-muted-foreground"}>
                    {visitor.status === "active" ? "Active" : "Completed"}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-medium">Purpose:</span>
                    <span>{visitor.purpose}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>In: {visitor.checkIn}</span>
                    {visitor.checkOut && <span>• Out: {visitor.checkOut}</span>}
                  </div>
                </div>

                {visitor.status === "active" && (
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
          ))}
        </div>
      </div>
    </div>
  );
}
