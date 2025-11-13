import { Home, Bed, MessageSquare, Utensils, UserCheck } from "lucide-react";
import { useLocation } from "wouter";

interface NavItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { id: "home", icon: Home, label: "Home", path: "/dashboard" },
  { id: "rooms", icon: Bed, label: "Rooms", path: "/rooms" },
  { id: "complaints", icon: MessageSquare, label: "Complaints", path: "/complaints" },
  { id: "mess", icon: Utensils, label: "Mess", path: "/mess" },
  { id: "visitors", icon: UserCheck, label: "Visitors", path: "/visitors" },
];

export default function BottomNav() {
  const [location, navigate] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-40">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              data-testid={`nav-${item.id}`}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 hover-elevate active-elevate-2 rounded-md"
            >
              <item.icon 
                className={`w-6 h-6 ${isActive ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
              />
              <span className={`text-xs ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
