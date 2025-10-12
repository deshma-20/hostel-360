import { 
  type User, 
  type InsertUser,
  type Room,
  type InsertRoom,
  type Complaint,
  type InsertComplaint,
  type MessFeedback,
  type InsertMessFeedback,
  type Visitor,
  type InsertVisitor,
  type LostFound,
  type InsertLostFound,
  type SOSAlert,
  type InsertSOSAlert,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Room methods
  getAllRooms(): Promise<Room[]>;
  getRoom(id: string): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: string, room: Partial<InsertRoom>): Promise<Room | undefined>;
  
  // Complaint methods
  getAllComplaints(): Promise<Complaint[]>;
  getComplaintsByUser(userId: string): Promise<Complaint[]>;
  getComplaint(id: string): Promise<Complaint | undefined>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  updateComplaint(id: string, complaint: Partial<InsertComplaint>): Promise<Complaint | undefined>;
  
  // Mess Feedback methods
  getAllMessFeedback(): Promise<MessFeedback[]>;
  getMessFeedbackByUser(userId: string): Promise<MessFeedback[]>;
  createMessFeedback(feedback: InsertMessFeedback): Promise<MessFeedback>;
  
  // Visitor methods
  getAllVisitors(): Promise<Visitor[]>;
  getActiveVisitors(): Promise<Visitor[]>;
  getVisitor(id: string): Promise<Visitor | undefined>;
  createVisitor(visitor: InsertVisitor): Promise<Visitor>;
  updateVisitor(id: string, visitor: Partial<Visitor>): Promise<Visitor | undefined>;
  
  // Lost & Found methods
  getAllLostFound(): Promise<LostFound[]>;
  getActiveLostFound(): Promise<LostFound[]>;
  getLostFoundByType(type: string): Promise<LostFound[]>;
  getLostFound(id: string): Promise<LostFound | undefined>;
  createLostFound(item: InsertLostFound): Promise<LostFound>;
  updateLostFound(id: string, item: Partial<LostFound>): Promise<LostFound | undefined>;
  
  // SOS Alert methods
  getAllSOSAlerts(): Promise<SOSAlert[]>;
  getActiveSOSAlerts(): Promise<SOSAlert[]>;
  getSOSAlert(id: string): Promise<SOSAlert | undefined>;
  createSOSAlert(alert: InsertSOSAlert): Promise<SOSAlert>;
  updateSOSAlert(id: string, alert: Partial<SOSAlert>): Promise<SOSAlert | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private rooms: Map<string, Room>;
  private complaints: Map<string, Complaint>;
  private messFeedback: Map<string, MessFeedback>;
  private visitors: Map<string, Visitor>;
  private lostFound: Map<string, LostFound>;
  private sosAlerts: Map<string, SOSAlert>;

  constructor() {
    this.users = new Map();
    this.rooms = new Map();
    this.complaints = new Map();
    this.messFeedback = new Map();
    this.visitors = new Map();
    this.lostFound = new Map();
    this.sosAlerts = new Map();
    
    this.seedInitialData();
  }

  private seedInitialData() {
    const demoUsers: User[] = [
      { id: randomUUID(), username: "student123", password: "student123", role: "student", name: "John Doe" },
      { id: randomUUID(), username: "staff001", password: "staff001", role: "staff", name: "Jane Smith" },
      { id: randomUUID(), username: "warden001", password: "warden001", role: "warden", name: "Robert Johnson" },
    ];

    demoUsers.forEach(user => this.users.set(user.id, user));

    const demoRooms: Room[] = [
      { id: randomUUID(), number: "101", floor: 1, capacity: 4, occupied: 2, status: "available" },
      { id: randomUUID(), number: "102", floor: 1, capacity: 4, occupied: 4, status: "full" },
      { id: randomUUID(), number: "103", floor: 1, capacity: 3, occupied: 0, status: "maintenance" },
      { id: randomUUID(), number: "201", floor: 2, capacity: 4, occupied: 3, status: "available" },
      { id: randomUUID(), number: "202", floor: 2, capacity: 4, occupied: 1, status: "available" },
      { id: randomUUID(), number: "203", floor: 2, capacity: 2, occupied: 2, status: "full" },
      { id: randomUUID(), number: "301", floor: 3, capacity: 4, occupied: 1, status: "available" },
      { id: randomUUID(), number: "302", floor: 3, capacity: 3, occupied: 2, status: "available" },
    ];

    demoRooms.forEach(room => this.rooms.set(room.id, room));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id, 
      username: insertUser.username, 
      password: insertUser.password,
      role: insertUser.role || "student",
      name: insertUser.name || null,
    };
    this.users.set(id, user);
    return user;
  }

  async getAllRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async getRoom(id: string): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = randomUUID();
    const room: Room = { 
      id, 
      number: insertRoom.number,
      floor: insertRoom.floor,
      capacity: insertRoom.capacity,
      occupied: insertRoom.occupied || 0,
      status: insertRoom.status || "available",
    };
    this.rooms.set(id, room);
    return room;
  }

  async updateRoom(id: string, roomUpdate: Partial<InsertRoom>): Promise<Room | undefined> {
    const room = this.rooms.get(id);
    if (!room) return undefined;
    
    const updatedRoom = { ...room, ...roomUpdate };
    this.rooms.set(id, updatedRoom);
    return updatedRoom;
  }

  async getAllComplaints(): Promise<Complaint[]> {
    return Array.from(this.complaints.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getComplaintsByUser(userId: string): Promise<Complaint[]> {
    return Array.from(this.complaints.values())
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getComplaint(id: string): Promise<Complaint | undefined> {
    return this.complaints.get(id);
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const id = randomUUID();
    const complaint: Complaint = { 
      id, 
      userId: insertComplaint.userId,
      category: insertComplaint.category,
      location: insertComplaint.location,
      description: insertComplaint.description,
      status: insertComplaint.status || "pending",
      priority: insertComplaint.priority || "medium",
      createdAt: new Date(),
      resolvedAt: null,
    };
    this.complaints.set(id, complaint);
    return complaint;
  }

  async updateComplaint(id: string, complaintUpdate: Partial<InsertComplaint>): Promise<Complaint | undefined> {
    const complaint = this.complaints.get(id);
    if (!complaint) return undefined;
    
    const updatedComplaint = { 
      ...complaint, 
      ...complaintUpdate,
      resolvedAt: complaintUpdate.status === "resolved" ? new Date() : complaint.resolvedAt,
    };
    this.complaints.set(id, updatedComplaint);
    return updatedComplaint;
  }

  async getAllMessFeedback(): Promise<MessFeedback[]> {
    return Array.from(this.messFeedback.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getMessFeedbackByUser(userId: string): Promise<MessFeedback[]> {
    return Array.from(this.messFeedback.values())
      .filter(f => f.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createMessFeedback(insertFeedback: InsertMessFeedback): Promise<MessFeedback> {
    const id = randomUUID();
    const feedback: MessFeedback = { 
      id, 
      userId: insertFeedback.userId,
      meal: insertFeedback.meal,
      qualityRating: insertFeedback.qualityRating,
      tasteRating: insertFeedback.tasteRating,
      wastage: insertFeedback.wastage || false,
      comments: insertFeedback.comments || null,
      createdAt: new Date(),
    };
    this.messFeedback.set(id, feedback);
    return feedback;
  }

  async getAllVisitors(): Promise<Visitor[]> {
    return Array.from(this.visitors.values()).sort((a, b) => 
      new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime()
    );
  }

  async getActiveVisitors(): Promise<Visitor[]> {
    return Array.from(this.visitors.values())
      .filter(v => v.status === "checked-in")
      .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
  }

  async getVisitor(id: string): Promise<Visitor | undefined> {
    return this.visitors.get(id);
  }

  async createVisitor(insertVisitor: InsertVisitor): Promise<Visitor> {
    const id = randomUUID();
    const visitor: Visitor = { 
      id, 
      ...insertVisitor,
      checkIn: new Date(),
      checkOut: null,
      status: "checked-in",
    };
    this.visitors.set(id, visitor);
    return visitor;
  }

  async updateVisitor(id: string, visitorUpdate: Partial<Visitor>): Promise<Visitor | undefined> {
    const visitor = this.visitors.get(id);
    if (!visitor) return undefined;
    
    const updatedVisitor = { 
      ...visitor, 
      ...visitorUpdate,
      checkOut: visitorUpdate.status === "checked-out" ? new Date() : visitor.checkOut,
    };
    this.visitors.set(id, updatedVisitor);
    return updatedVisitor;
  }

  async getAllLostFound(): Promise<LostFound[]> {
    return Array.from(this.lostFound.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getActiveLostFound(): Promise<LostFound[]> {
    return Array.from(this.lostFound.values())
      .filter(item => item.status === "active")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getLostFoundByType(type: string): Promise<LostFound[]> {
    return Array.from(this.lostFound.values())
      .filter(item => item.type === type && item.status === "active")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getLostFound(id: string): Promise<LostFound | undefined> {
    return this.lostFound.get(id);
  }

  async createLostFound(insertItem: InsertLostFound): Promise<LostFound> {
    const id = randomUUID();
    const item: LostFound = { 
      id, 
      ...insertItem,
      createdAt: new Date(),
      resolvedAt: null,
      status: "active",
    };
    this.lostFound.set(id, item);
    return item;
  }

  async updateLostFound(id: string, itemUpdate: Partial<LostFound>): Promise<LostFound | undefined> {
    const item = this.lostFound.get(id);
    if (!item) return undefined;
    
    const updatedItem = { 
      ...item, 
      ...itemUpdate,
      resolvedAt: itemUpdate.status === "resolved" ? new Date() : item.resolvedAt,
    };
    this.lostFound.set(id, updatedItem);
    return updatedItem;
  }

  async getAllSOSAlerts(): Promise<SOSAlert[]> {
    return Array.from(this.sosAlerts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getActiveSOSAlerts(): Promise<SOSAlert[]> {
    return Array.from(this.sosAlerts.values())
      .filter(alert => alert.status === "active")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getSOSAlert(id: string): Promise<SOSAlert | undefined> {
    return this.sosAlerts.get(id);
  }

  async createSOSAlert(insertAlert: InsertSOSAlert): Promise<SOSAlert> {
    const id = randomUUID();
    const alert: SOSAlert = { 
      id, 
      userId: insertAlert.userId,
      userName: insertAlert.userName,
      roomNumber: insertAlert.roomNumber || null,
      location: insertAlert.location,
      createdAt: new Date(),
      resolvedAt: null,
      status: "active",
    };
    this.sosAlerts.set(id, alert);
    return alert;
  }

  async updateSOSAlert(id: string, alertUpdate: Partial<SOSAlert>): Promise<SOSAlert | undefined> {
    const alert = this.sosAlerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert = { 
      ...alert, 
      ...alertUpdate,
      resolvedAt: alertUpdate.status === "resolved" ? new Date() : alert.resolvedAt,
    };
    this.sosAlerts.set(id, updatedAlert);
    return updatedAlert;
  }
}

export const storage = new MemStorage();
