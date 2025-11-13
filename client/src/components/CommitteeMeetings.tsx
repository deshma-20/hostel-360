import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProfileMenu from "./ProfileMenu";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";

interface Meeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  attendees: number;
  type: "scheduled" | "completed";
}

const sampleMeetings: Meeting[] = [
  {
    id: "1",
    title: "Monthly Hostel Committee Meeting",
    date: new Date(2025, 10, 15), // Nov 15, 2025
    time: "4:00 PM",
    location: "Common Room",
    attendees: 12,
    type: "scheduled",
  },
  {
    id: "2",
    title: "Mess Menu Discussion",
    date: new Date(2025, 10, 20), // Nov 20, 2025
    time: "5:30 PM",
    location: "Mess Hall",
    attendees: 8,
    type: "scheduled",
  },
  {
    id: "3",
    title: "Facilities Review Meeting",
    date: new Date(2025, 10, 5), // Nov 5, 2025
    time: "3:00 PM",
    location: "Warden Office",
    attendees: 10,
    type: "completed",
  },
];

export default function CommitteeMeetings() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const meetingsOnSelectedDate = sampleMeetings.filter(
    (meeting) =>
      selectedDate &&
      meeting.date.toDateString() === selectedDate.toDateString()
  );

  const upcomingMeetings = sampleMeetings
    .filter((meeting) => meeting.type === "scheduled")
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const meetingDates = sampleMeetings.map((meeting) =>
    meeting.date.toDateString()
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-bold">Committee Meetings</h1>
            <p className="text-sm opacity-90">Schedule & calendar</p>
          </div>
          <div>
            <ProfileMenu />
          </div>
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto space-y-4">
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
                  meeting: (date) => meetingDates.includes(date.toDateString()),
                }}
                modifiersStyles={{
                  meeting: {
                    fontWeight: "bold",
                    textDecoration: "underline",
                    color: "hsl(var(--primary))",
                  },
                }}
              />
            </div>
          </div>
        </Card>

        {/* Selected Date Meetings */}
        {selectedDate && meetingsOnSelectedDate.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Meetings on {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            {meetingsOnSelectedDate.map((meeting) => (
              <Card key={meeting.id} className="overflow-visible">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{meeting.title}</h3>
                    <Badge
                      className={
                        meeting.type === "scheduled"
                          ? "bg-chart-3/10 text-chart-3"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {meeting.type === "scheduled" ? "Upcoming" : "Completed"}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{meeting.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{meeting.attendees} attendees</span>
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
          {upcomingMeetings.length === 0 ? (
            <Card className="overflow-visible">
              <div className="p-4 text-center text-muted-foreground">
                No upcoming meetings scheduled
              </div>
            </Card>
          ) : (
            upcomingMeetings.map((meeting) => (
              <Card key={meeting.id} className="overflow-visible hover-elevate">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{meeting.title}</h3>
                    <Badge className="bg-chart-3/10 text-chart-3">
                      {format(meeting.date, "MMM d")}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{meeting.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{meeting.attendees} attendees</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
