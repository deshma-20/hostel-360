import SOSButton from '../SOSButton';

export default function SOSButtonExample() {
  return (
    <div className="h-screen bg-background relative">
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Click the SOS button</p>
      </div>
      <SOSButton />
    </div>
  );
}
