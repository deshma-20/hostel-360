import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import RoomsPage from "@/pages/rooms";
import ComplaintsPage from "@/pages/complaints";
import MessPage from "@/pages/mess";
import VisitorsPage from "@/pages/visitors";
import LostFoundPage from "@/pages/lost-found";
import AdminPage from "@/pages/admin";
import RegisterPage from "@/pages/Register";
import MeetingsPage from "@/pages/meetings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/register" component={RegisterPage} /> {/* ✅ moved above NotFound */}
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/rooms" component={RoomsPage} />
      <Route path="/complaints" component={ComplaintsPage} />
      <Route path="/mess" component={MessPage} />
      <Route path="/visitors" component={VisitorsPage} />
      <Route path="/lost-found" component={LostFoundPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/meetings" component={MeetingsPage} />
      <Route component={NotFound} /> {/* ✅ keep this last */}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
