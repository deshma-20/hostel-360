import { Briefcase, Shield, User } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Role {
  id: "student" | "staff" | "warden";
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const roles: Role[] = [
  { id: "student", name: "Student", icon: User, color: "bg-primary" },
  { id: "staff", name: "Staff", icon: Briefcase, color: "bg-chart-2" },
  { id: "warden", name: "Warden", icon: Shield, color: "bg-chart-3" },
];

interface RoleSelectorProps {
  onRoleSelect: (role: string) => void;
}

export default function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/80 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
          <Shield className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">HOSTEL 360°</h1>
        <p className="text-white/90 text-sm">Select Your Role</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {roles.map((role) => (
          <Card
            key={role.id}
            onClick={() => onRoleSelect(role.id)}
            data-testid={`button-role-${role.id}`}
            className="cursor-pointer hover-elevate active-elevate-2 transition-all overflow-visible"
          >
            <div className="p-6 flex items-center gap-4">
              <div className={`${role.color} w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0`}>
                <role.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{role.name}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
