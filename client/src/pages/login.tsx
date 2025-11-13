import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import LoginForm from "@/components/LoginForm";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"student" | "warden" | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string; role: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return await response.json();
    },
    onSuccess: async (data) => {
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("username", data.username);
      if (data.name) {
        localStorage.setItem("userName", data.name);
      }
      
      // Fetch room assignment for students
      if (data.role === "student") {
        try {
          const roomsResponse = await fetch("/api/rooms");
          const rooms = await roomsResponse.json();
          
          // Find the room this student is assigned to
          for (const room of rooms) {
            if (room.students && room.students.some((s: any) => s.id === data.id)) {
              localStorage.setItem("roomNumber", room.number);
              break;
            }
          }
        } catch (error) {
          console.error("Failed to fetch room assignment:", error);
        }
      }
      
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role as "student" | "warden");
  };

  const handleLogin = (credentials: { username: string; password: string }) => {
    loginMutation.mutate({ ...credentials, role: selectedRole! });
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  if (selectedRole) {
    return (
      <LoginForm role={selectedRole} onLogin={handleLogin} onBack={handleBack} />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <RoleSelector onRoleSelect={handleRoleSelect} />
      <div className="mt-6">
        <Button variant="link" onClick={() => navigate("/register")}>
          Don’t have an account? Register
        </Button>
      </div>
    </div>
  );
}
