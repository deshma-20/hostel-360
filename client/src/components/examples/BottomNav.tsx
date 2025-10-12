import { Route, Switch } from "wouter";
import BottomNav from '../BottomNav';

export default function BottomNavExample() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center">
        <Switch>
          <Route path="/" component={() => <div className="text-center">Home</div>} />
          <Route path="/rooms" component={() => <div className="text-center">Rooms</div>} />
          <Route path="/complaints" component={() => <div className="text-center">Complaints</div>} />
          <Route path="/mess" component={() => <div className="text-center">Mess</div>} />
          <Route path="/visitors" component={() => <div className="text-center">Visitors</div>} />
        </Switch>
      </div>
      <BottomNav />
    </div>
  );
}
