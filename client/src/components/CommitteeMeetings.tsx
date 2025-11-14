import { Calendar, Clock, MapPin, Plus, Edit, Trash2, FileText, Users, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ProfileMenu from "./ProfileMenu";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  purpose: string;
  createdBy: string;
}

export default function CommitteeMeetings() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');
  const isWarden = userRole === 'warden';

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    purpose: "",
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const createEventMutation = useMutation({
    mutationFn: async (eventData: typeof formData) => {
      return await apiRequest("POST", "/api/events", {
        ...eventData,
        createdBy: userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "✅ Event Created",
        description: "The event has been added to the calendar successfully.",
      });
      setDialogOpen(false);
      resetForm();
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async (eventData: typeof formData & { id: string }) => {
      return await apiRequest("PATCH", `/api/events/${eventData.id}`, {
        name: eventData.name,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        purpose: eventData.purpose,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "✅ Event Updated",
        description: "The event has been updated successfully.",
      });
      setDialogOpen(false);
      setEditingEvent(null);
      resetForm();
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "✅ Event Deleted",
        description: "The event has been removed from the calendar.",
      });
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      time: "",
      location: "",
      purpose: "",
    });
  };

  const handleOpenDialog = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        name: event.name,
        date: new Date(event.date).toISOString().split('T')[0],
        time: event.time,
        location: event.location,
        purpose: event.purpose,
      });
    } else {
      setEditingEvent(null);
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      updateEventMutation.mutate({ ...formData, id: editingEvent.id });
    } else {
      createEventMutation.mutate(formData);
    }
  };

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteEventMutation.mutate(eventToDelete);
    }
  };

  const eventsOnSelectedDate = events.filter(
    (event) =>
      selectedDate &&
      new Date(event.date).toDateString() === selectedDate.toDateString()
  );

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const allEventsSorted = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const eventDates = events.map((event) =>
    new Date(event.date).toDateString()
  );

  const todayEvents = events.filter(
    (event) => new Date(event.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-bold">Committee Meetings</h1>
            <p className="text-sm opacity-90">Schedule & Calendar</p>
          </div>
          <div>
            <ProfileMenu />
          </div>
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Today's Events Notification */}
        {todayEvents.length > 0 && (
          <Card className="border-primary border-2 bg-primary/5">
            <div className="p-3">
              <h3 className="font-semibold text-primary mb-2 flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                📅 Today's Events!
              </h3>
              {todayEvents.map((event) => (
                <div key={event.id} className="text-sm text-muted-foreground">
                  • {event.name} at {event.time}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Add Event Button - Warden Only */}
        {isWarden && (
          <Button
            onClick={() => handleOpenDialog()}
            className="w-full"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Event
          </Button>
        )}

        {/* Calendar Card */}
        <Card className="overflow-visible">
          <div className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Meeting Calendar
            </h3>
            <div className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  event: (date) => eventDates.includes(date.toDateString()),
                }}
                modifiersStyles={{
                  event: {
                    fontWeight: "bold",
                    textDecoration: "underline",
                    color: "hsl(var(--primary))",
                  },
                }}
              />
            </div>
          </div>
        </Card>

        {/* Selected Date Events */}
        {selectedDate && eventsOnSelectedDate.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Meetings on {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            {eventsOnSelectedDate.map((event) => (
              <Card key={event.id} className="overflow-visible">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{event.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-chart-3/10 text-chart-3">
                        {format(new Date(event.date), "MMM d")}
                      </Badge>
                      {isWarden && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(event)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(event.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-0.5" />
                      <span>{event.purpose}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Upcoming Meetings */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">
            Upcoming Meetings
          </h3>
          {upcomingEvents.length === 0 ? (
            <Card className="overflow-visible">
              <div className="p-4 text-center text-muted-foreground">
                No upcoming meetings scheduled
              </div>
            </Card>
          ) : (
            upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-visible hover-elevate">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{event.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-chart-3/10 text-chart-3">
                        {format(new Date(event.date), "MMM d")}
                      </Badge>
                      {isWarden && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(event)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(event.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-0.5" />
                      <span>{event.purpose}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* All Events Section - Visible to Both Student and Warden */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">
            All Events
          </h3>
          {allEventsSorted.length === 0 ? (
            <Card className="overflow-visible">
              <div className="p-4 text-center text-muted-foreground">
                No events scheduled
              </div>
            </Card>
          ) : (
            allEventsSorted.map((event) => (
              <Card key={event.id} className="overflow-visible hover-elevate">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{event.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-chart-3/10 text-chart-3">
                        {format(new Date(event.date), "MMM d")}
                      </Badge>
                      {isWarden && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(event)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(event.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-0.5" />
                      <span>{event.purpose}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Edit Event" : "Add New Event"}
            </DialogTitle>
            <DialogDescription>
              Fill in the event details below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Event Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter event name"
                required
              />
            </div>
            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Time *</Label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Location *</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter event location"
                required
              />
            </div>
            <div>
              <Label>Purpose *</Label>
              <Textarea
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="Describe the purpose of the event"
                required
                rows={3}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setEditingEvent(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createEventMutation.isPending || updateEventMutation.isPending}
              >
                {editingEvent ? "Update Event" : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event from the calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
