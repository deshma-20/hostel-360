import FeatureCard from '../FeatureCard';
import { Home, Bell, MessageSquare } from 'lucide-react';

export default function FeatureCardExample() {
  return (
    <div className="p-4 grid grid-cols-3 gap-4 max-w-md">
      <FeatureCard icon={Home} label="Home" onClick={() => console.log('Home clicked')} />
      <FeatureCard icon={Bell} label="Alerts" color="text-destructive" onClick={() => console.log('Alerts clicked')} />
      <FeatureCard icon={MessageSquare} label="Messages" color="text-chart-2" onClick={() => console.log('Messages clicked')} />
    </div>
  );
}
