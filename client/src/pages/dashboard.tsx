import Dashboard from "@/components/Dashboard";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<"student" | "warden">("student");
  const [, navigate] = useLocation();

  useEffect(() => {
    const role = localStorage.getItem('userRole') as "student" | "warden" | null;
    if (!role) {
      navigate('/');
      return;
    }
    setUserRole(role);
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <Dashboard userRole={userRole} />
      <BottomNav />
    </div>
  );
}
