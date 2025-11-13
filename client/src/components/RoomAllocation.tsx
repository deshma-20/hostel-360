import { Bed, Users, CheckCircle, Clock, XCircle, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus, Edit2, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ProfileMenu from "./ProfileMenu";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Room } from "@shared/schema";

const statusConfig = {
  available: { icon: CheckCircle, color: "text-chart-3", bg: "bg-chart-3/10", label: "Available" },
  full: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Full" },
  maintenance: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Maintenance" },
};

export default function RoomAllocation() {
  const { data: rooms = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/rooms"],
  });

  const { toast } = useToast();
  const [submittingRoomId, setSubmittingRoomId] = useState<string | null>(null);
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null);
  const [roomMembers, setRoomMembers] = useState<Record<string, any[]>>({});
  const [localRooms, setLocalRooms] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<null | "add" | "update" | "delete" | "apply">(null);
  const [dialogRoomId, setDialogRoomId] = useState<string | null>(null);
  const [dialogForm, setDialogForm] = useState<any>({ roomNo: "", appliedBy: "", reason: "", membersText: "" });
  const [searchQuery, setSearchQuery] = useState("");

  // determine logged in role from localStorage (set on login)
  const userRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;

  // initialize roomMembers mapping with either provided students or generated sample names
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      const map: Record<string, any[]> = {};
      rooms.forEach((r: any) => {
        // The server provides `students` as an array of user objects
        map[r.id] = r.students || [];
      });
      setRoomMembers(map);
      // Use the rooms data directly from the query
      setLocalRooms(rooms.map((r: any) => ({ ...r, capacity: r.capacity ?? 5 })));
    }
  }, [rooms]);

  // Filter rooms based on search query
  const filteredRooms = localRooms.filter(room => {
    const query = searchQuery.toLowerCase();
    return room.number.toLowerCase().includes(query) || 
           `room ${room.number}`.toLowerCase().includes(query) ||
           `floor ${room.floor}`.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h1 className="text-xl font-bold">Room Allocation</h1>
            <p className="text-sm opacity-90">Manage room assignments</p>
          </div>
          <div>
            <ProfileMenu />
          </div>
        </div>
      </header>

      <div className="p-4 max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by room number or floor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
            data-testid="input-search-rooms"
          />
        </div>
      </div>

      <div className="p-4 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading rooms...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchQuery ? "No rooms found matching your search" : "No rooms available"}
            </p>
          </div>
        ) : (
          filteredRooms.map((room) => {
            const status = room.status as keyof typeof statusConfig;
            const config = statusConfig[status] || statusConfig.available;
            const StatusIcon = config.icon;
            
            return (
              <Card
                key={room.id}
                data-testid={`room-card-${room.id}`}
                className="relative hover-elevate active-elevate-2 cursor-pointer overflow-hidden h-full"
                onClick={() => setExpandedRoomId(expandedRoomId === room.id ? null : room.id)}
              >
                <div className="p-4 flex flex-col h-full min-h-[200px]">
                  <div className="absolute top-3 right-3 z-40">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`More options for room ${room.number}`}
                          className="p-2 rounded-md bg-popover/80 hover:bg-accent/10 border border-transparent hover:border-border shadow-sm"
                        >
                          <MoreVertical className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {userRole === 'warden' && (
                          <>
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); e.stopPropagation(); setDialogType('add'); setDialogRoomId(room.id); setDialogForm({ membersText: '', roomNo: room.number, appliedBy: localStorage.getItem('userName') || '', reason: '' }); setDialogOpen(true); }}>
                              <Plus className="w-4 h-4 mr-2" /> Add member
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); e.stopPropagation(); setDialogType('update'); setDialogRoomId(room.id); setDialogForm({ membersText: (roomMembers[room.id] || []).map((m:any)=>m.name).join(', '), roomNo: room.number, appliedBy: localStorage.getItem('userName') || '', reason: '' }); setDialogOpen(true); }}>
                              <Edit2 className="w-4 h-4 mr-2" /> Update members
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); e.stopPropagation(); setDialogType('delete'); setDialogRoomId(room.id); setDialogForm({ membersText: '', roomNo: room.number, appliedBy: localStorage.getItem('userName') || '', reason: '' }); setDialogOpen(true); }}>
                              <Trash2 className="w-4 h-4 mr-2" /> Delete members
                            </DropdownMenuItem>
                          </>
                        )}
                        {userRole === 'student' && (
                          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); e.stopPropagation(); setDialogType('apply'); setDialogRoomId(room.id); setDialogForm({ membersText: '', roomNo: room.number, appliedBy: localStorage.getItem('userName') || '', reason: '' }); setDialogOpen(true); }}>
                            Apply for room change
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                        <Bed className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Room {room.number}</h3>
                        <p className="text-sm text-muted-foreground">Floor {room.floor}</p>
                      </div>
                    </div>
                    {/* status badge removed from header to place at bottom-right */}
                  </div>
                  
                  {/* Students list: shown only when expanded */}
                  {expandedRoomId === room.id && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium">Students</h4>
                      {roomMembers[room.id] && roomMembers[room.id].length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2 max-h-36 overflow-auto">
                          {roomMembers[room.id].map((s: any) => (
                            <Badge key={s.id} className="bg-muted/10 text-muted-foreground">
                              {s.name || s.username || 'Unknown'}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-2">No student details available</p>
                      )}

                      {/* Update members is now available via the top-right menu to avoid duplicate controls */}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm mt-4">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {room.occupied}/{room.capacity} Occupied
                    </span>
                    <div className="flex-1 bg-muted rounded-full h-2 ml-2">
                      <div 
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-auto">
                    {/* Availability badge at bottom-right */}
                    <Badge className={`${config.bg} ${config.color} gap-1 px-2 py-1 rounded-md ml-2`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="text-sm">{config.label}</span>
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Shared dialog for add/update/delete/apply actions */}
      <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'add' && 'Add Member'}
              {dialogType === 'update' && 'Update Members'}
              {dialogType === 'delete' && 'Delete Members'}
              {dialogType === 'apply' && 'Apply for Room Change'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'apply' ? 'Fill the form to apply for a room change.' : 'Manage members for the selected room.'}
            </DialogDescription>
          </DialogHeader>

          <div>
            {dialogType === 'apply' ? (
              <div className="grid gap-2">
                <label className="text-sm">Room no.</label>
                <input className="input w-full" value={dialogForm.roomNo || ''} onChange={(e) => setDialogForm((s:any)=>({ ...s, roomNo: e.target.value }))} />
                <label className="text-sm">Applied by</label>
                <input className="input w-full" value={dialogForm.appliedBy || ''} onChange={(e) => setDialogForm((s:any)=>({ ...s, appliedBy: e.target.value }))} />
                <label className="text-sm">Reason</label>
                <textarea className="textarea w-full" value={dialogForm.reason || ''} onChange={(e) => setDialogForm((s:any)=>({ ...s, reason: e.target.value }))} />
              </div>
            ) : (
              <div className="grid gap-2">
                <label className="text-sm">Members (comma separated names)</label>
                <textarea className="textarea w-full" value={dialogForm.membersText || ''} onChange={(e) => setDialogForm((s:any)=>({ ...s, membersText: e.target.value }))} />
                {dialogType === 'delete' && <p className="text-xs text-muted-foreground">Enter names to delete (comma separated) or leave blank to cancel.</p>}
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={async () => {
                // handle submit based on type
                if (!dialogRoomId) { setDialogOpen(false); return; }
                const roomId = dialogRoomId;
                if (dialogType === 'add') {
                  const names = (dialogForm.membersText || '').split(',').map((s:string)=>s.trim()).filter(Boolean);
                  if (names.length === 0) { toast({ title: 'No names', description: 'Please provide at least one name.' }); return; }
                  const newMembers = names.map((n:string, idx:number) => ({ id: `${roomId}-u-${Date.now()}-${idx}`, name: n }));
                  setRoomMembers((prev) => ({ ...prev, [roomId]: [...(prev[roomId]||[]), ...newMembers] }));
                  setLocalRooms((prev) => prev.map((r) => r.id === roomId ? { ...r, occupied: (roomMembers[roomId]||[]).length + newMembers.length, status: ((r.status==='maintenance')? 'maintenance' : (((roomMembers[roomId]||[]).length + newMembers.length) >= r.capacity ? 'full' : 'available')) } : r));
                  toast({ title: 'Member(s) added' });
                } else if (dialogType === 'update') {
                  const names = (dialogForm.membersText || '').split(',').map((s:string)=>s.trim()).filter(Boolean);
                  const newMembers = names.map((n:string, idx:number) => ({ id: `${roomId}-u-${Date.now()}-${idx}`, name: n }));
                  setRoomMembers((prev) => ({ ...prev, [roomId]: newMembers }));
                  setLocalRooms((prev) => prev.map((r) => r.id === roomId ? { ...r, occupied: newMembers.length, status: (r.status==='maintenance'? 'maintenance' : (newMembers.length >= r.capacity ? 'full' : 'available')) } : r));
                  toast({ title: 'Members updated' });
                } else if (dialogType === 'delete') {
                  const toDelete = (dialogForm.membersText || '').split(',').map((s:string)=>s.trim()).filter(Boolean);
                  if (toDelete.length === 0) { toast({ title: 'No names', description: 'Please provide names to delete.' }); return; }
                  setRoomMembers((prev) => {
                    const current = prev[roomId] || [];
                    const filtered = current.filter((m:any) => !toDelete.includes(m.name));
                    return { ...prev, [roomId]: filtered };
                  });
                  setLocalRooms((prev) => prev.map((r) => r.id === roomId ? ({ ...r, occupied: Math.max(0, ((roomMembers[roomId]||[]).length - toDelete.length)), status: (r.status==='maintenance'? 'maintenance' : (Math.max(0, ((roomMembers[roomId]||[]).length - toDelete.length)) >= r.capacity ? 'full' : 'available')) }) : r));
                  toast({ title: 'Members deleted' });
                } else if (dialogType === 'apply') {
                  // send to server
                  try {
                    const res = await fetch('/api/room-change', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ roomNo: dialogForm.roomNo, appliedBy: dialogForm.appliedBy, reason: dialogForm.reason, fromRoomId: dialogRoomId }) });
                    if (!res.ok) throw new Error('Server rejected');
                    toast({ title: 'Application sent' });
                  } catch (err) {
                    toast({ title: 'Failed', description: 'Could not submit application.' });
                  }
                }
                setDialogOpen(false);
              }}>Submit</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
