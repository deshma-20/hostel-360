import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import LoginForm from "@/components/LoginForm";
import { useLocation } from "wouter";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"student" | "staff" | "warden" | null>(null);
  const [, navigate] = useLocation();

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role as "student" | "staff" | "warden");
  };

  const handleLogin = (credentials: { username: string; password: string }) => {
    if (selectedRole) {
      localStorage.setItem('userRole', selectedRole);
      localStorage.setItem('username', credentials.username);
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  if (selectedRole) {
    return <LoginForm role={selectedRole} onLogin={handleLogin} onBack={handleBack} />;
  }

  return <RoleSelector onRoleSelect={handleRoleSelect} />;
}
