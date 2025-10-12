import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import LoginForm from "@/components/LoginForm";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"student" | "staff" | "warden" | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return await response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('username', data.username);
      if (data.name) {
        localStorage.setItem('userName', data.name);
      }
      navigate('/dashboard');
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
    setSelectedRole(role as "student" | "staff" | "warden");
  };

  const handleLogin = (credentials: { username: string; password: string }) => {
    loginMutation.mutate(credentials);
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  if (selectedRole) {
    return <LoginForm role={selectedRole} onLogin={handleLogin} onBack={handleBack} />;
  }

  return <RoleSelector onRoleSelect={handleRoleSelect} />;
}
