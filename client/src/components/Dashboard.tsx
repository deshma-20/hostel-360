import { Bell, DoorOpen, PenSquare, Star, Search, ClipboardCheck, User } from "lucide-react";
import FeatureCard from "./FeatureCard";
import SOSButton from "./SOSButton";
import { useLocation } from "wouter";

interface DashboardProps {
  userRole?: "student" | "staff" | "warden";
}

export default function Dashboard({ userRole = "student" }: DashboardProps) {
  const [, navigate] = useLocation();
  const username = localStorage.getItem('username') || 'User';

  const studentFeatures = [
    { icon: Bell, label: "SOS Emergency", color: "text-destructive", path: "/sos", testId: "feature-sos" },
    { icon: DoorOpen, label: "Room Info", color: "text-primary", path: "/rooms", testId: "feature-room" },
    { icon: PenSquare, label: "Complaint", color: "text-chart-2", path: "/complaints", testId: "feature-complaint" },
    { icon: Star, label: "Mess Feedback", color: "text-chart-3", path: "/mess", testId: "feature-mess" },
    { icon: Search, label: "Lost & Found", color: "text-warning", path: "/lost-found", testId: "feature-lost" },
    { icon: ClipboardCheck, label: "Visitors", color: "text-chart-5", path: "/visitors", testId: "feature-visitor" },
  ];

  const wardenFeatures = [
    { icon: User, label: "Dashboard", color: "text-primary", path: "/admin", testId: "feature-admin" },
    { icon: DoorOpen, label: "Allocate Rooms", color: "text-primary", path: "/rooms", testId: "feature-room" },
    { icon: PenSquare, label: "Complaints", color: "text-chart-2", path: "/complaints", testId: "feature-complaint" },
    { icon: Star, label: "Mess Reports", color: "text-chart-3", path: "/mess", testId: "feature-mess" },
    { icon: Search, label: "Lost Items", color: "text-warning", path: "/lost-found", testId: "feature-lost" },
    { icon: ClipboardCheck, label: "Visitor Logs", color: "text-chart-5", path: "/visitors", testId: "feature-visitor" },
  ];

  const features = userRole === "warden" || userRole === "staff" ? wardenFeatures : studentFeatures;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-bold">HOSTEL 360°</h1>
            <p className="text-sm opacity-90">Welcome, {username}</p>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
            data-testid="button-logout"
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover-elevate active-elevate-2"
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.label}
              icon={feature.icon}
              label={feature.label}
              color={feature.color}
              onClick={() => navigate(feature.path)}
              testId={feature.testId}
            />
          ))}
        </div>
      </div>

      {userRole === "student" && <SOSButton />}
    </div>
  );
}
