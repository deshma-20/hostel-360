import { Briefcase, Shield, User } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Role {
  id: "student" | "warden";
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const roles: Role[] = [
  { id: "student", name: "Student", icon: User, color: "bg-primary" },
  { id: "warden", name: "Warden", icon: Shield, color: "bg-chart-3" },
];

interface RoleSelectorProps {
  onRoleSelect: (role: string) => void;
}

export default function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary/80 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <div className="w-28 h-28 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Shield className="w-14 h-14 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">HOSTEL 360°</h1>
        <p className="text-white/90">Select Your Role to Continue</p>
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
