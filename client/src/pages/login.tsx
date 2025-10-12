import RoleSelector from "@/components/RoleSelector";
import { useLocation } from "wouter";

export default function LoginPage() {
  const [, navigate] = useLocation();

  const handleRoleSelect = (role: string) => {
    localStorage.setItem('userRole', role);
    navigate('/dashboard');
  };

  return <RoleSelector onRoleSelect={handleRoleSelect} />;
}
