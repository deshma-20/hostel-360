import { Bell, DoorOpen, PenSquare, Star, Search, ClipboardCheck, User, CalendarDays } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import FeatureCard from "./FeatureCard";
import SOSButton from "./SOSButton";
import { useLocation } from "wouter";
import { useState } from "react";

interface DashboardProps {
  userRole?: "student" | "warden";
}

export default function Dashboard({ userRole = "student" }: DashboardProps) {
  const [, navigate] = useLocation();
  const [sosDialogOpen, setSOSDialogOpen] = useState(false);
  const userName = localStorage.getItem('userName') || localStorage.getItem('username') || 'User';

  const studentFeatures = [
    { icon: Bell, label: "SOS Emergency", color: "text-destructive", path: "/sos", testId: "feature-sos", isSOSFeature: true },
    { icon: DoorOpen, label: "Room Info", color: "text-primary", path: "/rooms", testId: "feature-room" },
    { icon: PenSquare, label: "Complaint", color: "text-chart-2", path: "/complaints", testId: "feature-complaint" },
    { icon: Star, label: "Mess Feedback", color: "text-chart-3", path: "/mess", testId: "feature-mess" },
    { icon: Search, label: "Lost & Found", color: "text-warning", path: "/lost-found", testId: "feature-lost" },
    { icon: ClipboardCheck, label: "Visitors", color: "text-chart-5", path: "/visitors", testId: "feature-visitor" },
    { icon: CalendarDays, label: "Committee Meetings", color: "text-blue-600", path: "/meetings", testId: "feature-meetings" },
  ];

  const wardenFeatures = [
    { icon: User, label: "Dashboard", color: "text-primary", path: "/admin", testId: "feature-admin" },
    { icon: DoorOpen, label: "Allocate Rooms", color: "text-primary", path: "/rooms", testId: "feature-room" },
    { icon: PenSquare, label: "Complaints", color: "text-chart-2", path: "/complaints", testId: "feature-complaint" },
    { icon: Star, label: "Mess Reports", color: "text-chart-3", path: "/mess", testId: "feature-mess" },
    { icon: Search, label: "Lost Items", color: "text-warning", path: "/lost-found", testId: "feature-lost" },
    { icon: ClipboardCheck, label: "Visitor Logs", color: "text-chart-5", path: "/visitors", testId: "feature-visitor" },
    { icon: CalendarDays, label: "Committee Meetings", color: "text-blue-600", path: "/meetings", testId: "feature-meetings" },
  ];

  const features = userRole === "warden" ? wardenFeatures : studentFeatures;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-bold">HOSTEL 360°</h1>
            <p className="text-sm opacity-90">Welcome, {userName}</p>
          </div>
          <div>
            {/* profile menu */}
            <ProfileMenu />
          </div>
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
              onClick={() => {
                if ((feature as any).isSOSFeature) {
                  setSOSDialogOpen(true);
                } else {
                  navigate(feature.path);
                }
              }}
              testId={feature.testId}
            />
          ))}
        </div>
      </div>

      {userRole === "student" && <SOSButton triggerOpen={sosDialogOpen} onOpenChange={setSOSDialogOpen} />}
    </div>
  );
}
