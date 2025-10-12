import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Lock, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  role: "student" | "staff" | "warden";
  onLogin: (credentials: { username: string; password: string }) => void;
  onBack: () => void;
}

const roleConfig = {
  student: {
    title: "Student Login",
    color: "bg-primary",
    placeholder: "Enter Student ID",
    demoCredentials: { username: "student123", password: "student123" }
  },
  staff: {
    title: "Staff Login",
    color: "bg-chart-2",
    placeholder: "Enter Staff ID",
    demoCredentials: { username: "staff001", password: "staff001" }
  },
  warden: {
    title: "Warden Login",
    color: "bg-chart-3",
    placeholder: "Enter Warden ID",
    demoCredentials: { username: "warden001", password: "warden001" }
  }
};

export default function LoginForm({ role, onLogin, onBack }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  
  const config = roleConfig[role];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }

    if (username === config.demoCredentials.username && password === config.demoCredentials.password) {
      onLogin({ username, password });
    } else {
      toast({
        title: "Invalid Credentials",
        description: "Please check your username and password",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary/80 flex flex-col items-center justify-center p-6">
      <Button
        onClick={onBack}
        variant="ghost"
        className="absolute top-4 left-4 text-white hover:bg-white/20"
        data-testid="button-back"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">HOSTEL 360°</h1>
          <p className="text-white/90">{config.title}</p>
        </div>

        <Card className="overflow-visible">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username / ID</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder={config.placeholder}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  data-testid="input-username"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-password"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover-elevate active-elevate-2 p-1 rounded"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              data-testid="button-login"
            >
              Login
            </Button>

            <div className="bg-muted rounded-md p-3 text-sm">
              <p className="font-semibold mb-1">Demo Credentials:</p>
              <p className="text-muted-foreground">
                Username: <span className="font-mono">{config.demoCredentials.username}</span>
              </p>
              <p className="text-muted-foreground">
                Password: <span className="font-mono">{config.demoCredentials.password}</span>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
