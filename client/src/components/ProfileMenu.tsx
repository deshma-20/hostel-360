import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Shield } from "lucide-react";

export default function ProfileMenu() {
  const [, navigate] = useLocation();
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setName(localStorage.getItem("userName") || localStorage.getItem("username"));
    setRole(localStorage.getItem("userRole"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const Icon = role === 'warden' ? Shield : User;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover-elevate active-elevate-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-500 text-white">
                {(name || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="p-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-violet-600 to-cyan-500">
              {(name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold">{name || "Unknown"}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span>{role || "guest"}</span>
                {role === 'warden' && <Shield className="w-3 h-3" />}
              </div>
            </div>
          </div>
          <div className="border-t">
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleLogout(); }}>Log out</DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
