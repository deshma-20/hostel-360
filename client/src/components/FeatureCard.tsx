import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  label: string;
  color?: string;
  onClick?: () => void;
  testId?: string;
}

export default function FeatureCard({ icon: Icon, label, color = "text-primary", onClick, testId }: FeatureCardProps) {
  return (
    <Card
      onClick={onClick}
      data-testid={testId}
      className="cursor-pointer hover-elevate active-elevate-2 transition-all aspect-square flex flex-col items-center justify-center gap-3 overflow-visible"
    >
      <Icon className={`w-12 h-12 ${color}`} />
      <span className="text-sm font-medium text-center px-2">{label}</span>
    </Card>
  );
}
