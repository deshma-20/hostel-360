import { db } from './db';
import { 
  users, rooms, complaints, messFeedback, visitors, lostFound, sosAlerts, events,
  type User, type InsertUser,
  type Room, type InsertRoom,
  type Complaint, type InsertComplaint,
  type MessFeedback, type InsertMessFeedback,
  type Visitor, type InsertVisitor,
  type LostFound, type InsertLostFound,
  type SOSAlert, type InsertSOSAlert,
  type Event, type InsertEvent,
} from '@shared/schema';
import { eq } from 'drizzle-orm';

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: string, hashedPassword: string): Promise<User | undefined>;
  setPasswordResetToken(email: string, token: string, expiry: Date): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  clearPasswordResetToken(id: string): Promise<User | undefined>;
  
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
  deleteComplaint(id: string): Promise<Complaint | undefined>;
  
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
  createLostFound(item: InsertLostFound & { attachmentUrl?: string }): Promise<LostFound>;
  updateLostFound(id: string, item: Partial<LostFound>): Promise<LostFound | undefined>;
  deleteLostFound(id: string): Promise<LostFound | undefined>;
  
  // SOS Alert methods
  getAllSOSAlerts(): Promise<SOSAlert[]>;
  getActiveSOSAlerts(): Promise<SOSAlert[]>;
  getSOSAlert(id: string): Promise<SOSAlert | undefined>;
  createSOSAlert(alert: InsertSOSAlert): Promise<SOSAlert>;
  updateSOSAlert(id: string, alert: Partial<SOSAlert>): Promise<SOSAlert | undefined>;
  
  // Event methods
  getAllEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<Event | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async setPasswordResetToken(email: string, token: string, expiry: Date): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        resetToken: token,
        resetTokenExpiry: expiry
      })
      .where(eq(users.email, email))
      .returning();
    return user;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.resetToken, token));
    return user;
  }

  async clearPasswordResetToken(id: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        resetToken: null,
        resetTokenExpiry: null
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Room methods
  async getAllRooms(): Promise<Room[]> {
    return await db.select().from(rooms);
  }

  async getRoom(id: string): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    return room;
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const [room] = await db.insert(rooms).values(insertRoom).returning();
    return room;
  }

  async updateRoom(id: string, roomUpdate: Partial<InsertRoom>): Promise<Room | undefined> {
    const [room] = await db.update(rooms).set(roomUpdate).where(eq(rooms.id, id)).returning();
    return room;
  }

  // Complaint methods
  async getAllComplaints(): Promise<Complaint[]> {
    return await db.select().from(complaints);
  }

  async getComplaintsByUser(userId: string): Promise<Complaint[]> {
    return await db.select().from(complaints).where(eq(complaints.userId, userId));
  }

  async getComplaint(id: string): Promise<Complaint | undefined> {
    const [complaint] = await db.select().from(complaints).where(eq(complaints.id, id));
    return complaint;
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const [complaint] = await db.insert(complaints).values(insertComplaint).returning();
    return complaint;
  }

  async updateComplaint(id: string, complaintUpdate: Partial<InsertComplaint>): Promise<Complaint | undefined> {
    const updates: any = { ...complaintUpdate };
    if (complaintUpdate.status === 'resolved') {
      updates.resolvedAt = new Date();
    }
    const [complaint] = await db.update(complaints).set(updates).where(eq(complaints.id, id)).returning();
    return complaint;
  }

  async deleteComplaint(id: string): Promise<Complaint | undefined> {
    const [complaint] = await db.delete(complaints).where(eq(complaints.id, id)).returning();
    return complaint;
  }

  // Mess Feedback methods
  async getAllMessFeedback(): Promise<MessFeedback[]> {
    return await db.select().from(messFeedback);
  }

  async getMessFeedbackByUser(userId: string): Promise<MessFeedback[]> {
    return await db.select().from(messFeedback).where(eq(messFeedback.userId, userId));
  }

  async createMessFeedback(insertFeedback: InsertMessFeedback): Promise<MessFeedback> {
    const [feedback] = await db.insert(messFeedback).values(insertFeedback).returning();
    return feedback;
  }

  // Visitor methods
  async getAllVisitors(): Promise<Visitor[]> {
    return await db.select().from(visitors);
  }

  async getActiveVisitors(): Promise<Visitor[]> {
    return await db.select().from(visitors).where(eq(visitors.status, 'checked-in'));
  }

  async getVisitor(id: string): Promise<Visitor | undefined> {
    const [visitor] = await db.select().from(visitors).where(eq(visitors.id, id));
    return visitor;
  }

  async createVisitor(insertVisitor: InsertVisitor): Promise<Visitor> {
    const [visitor] = await db.insert(visitors).values(insertVisitor).returning();
    return visitor;
  }

  async updateVisitor(id: string, visitorUpdate: Partial<Visitor>): Promise<Visitor | undefined> {
    const [visitor] = await db.update(visitors).set(visitorUpdate).where(eq(visitors.id, id)).returning();
    return visitor;
  }

  // Lost & Found methods
  async getAllLostFound(): Promise<LostFound[]> {
    return await db.select().from(lostFound);
  }

  async getActiveLostFound(): Promise<LostFound[]> {
    return await db.select().from(lostFound).where(eq(lostFound.status, 'active'));
  }

  async getLostFoundByType(type: string): Promise<LostFound[]> {
    return await db.select().from(lostFound).where(eq(lostFound.type, type));
  }

  async getLostFound(id: string): Promise<LostFound | undefined> {
    const [item] = await db.select().from(lostFound).where(eq(lostFound.id, id));
    return item;
  }

  async createLostFound(insertItem: InsertLostFound & { attachmentUrl?: string }): Promise<LostFound> {
    const [item] = await db.insert(lostFound).values(insertItem).returning();
    return item;
  }

  async updateLostFound(id: string, itemUpdate: Partial<LostFound>): Promise<LostFound | undefined> {
    const [item] = await db.update(lostFound).set(itemUpdate).where(eq(lostFound.id, id)).returning();
    return item;
  }

  async deleteLostFound(id: string): Promise<LostFound | undefined> {
    const [item] = await db.delete(lostFound).where(eq(lostFound.id, id)).returning();
    return item;
  }

  // SOS Alert methods
  async getAllSOSAlerts(): Promise<SOSAlert[]> {
    return await db.select().from(sosAlerts);
  }

  async getActiveSOSAlerts(): Promise<SOSAlert[]> {
    return await db.select().from(sosAlerts).where(eq(sosAlerts.status, 'active'));
  }

  async getSOSAlert(id: string): Promise<SOSAlert | undefined> {
    const [alert] = await db.select().from(sosAlerts).where(eq(sosAlerts.id, id));
    return alert;
  }

  async createSOSAlert(insertAlert: InsertSOSAlert): Promise<SOSAlert> {
    const [alert] = await db.insert(sosAlerts).values(insertAlert).returning();
    return alert;
  }

  async updateSOSAlert(id: string, alertUpdate: Partial<SOSAlert>): Promise<SOSAlert | undefined> {
    const updates: any = { ...alertUpdate };
    if (alertUpdate.status === 'resolved') {
      updates.resolvedAt = new Date();
    }
    const [alert] = await db.update(sosAlerts).set(updates).where(eq(sosAlerts.id, id)).returning();
    return alert;
  }

  // Event methods
  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const eventData: any = {
      ...insertEvent,
      date: typeof insertEvent.date === 'string' ? new Date(insertEvent.date) : insertEvent.date,
    };
    const [event] = await db.insert(events).values(eventData).returning();
    return event;
  }

  async updateEvent(id: string, eventUpdate: Partial<Event>): Promise<Event | undefined> {
    const updates: any = { 
      ...eventUpdate,
      updatedAt: new Date(),
    };
    if (eventUpdate.date) {
      updates.date = typeof eventUpdate.date === 'string' ? new Date(eventUpdate.date) : eventUpdate.date;
    }
    const [event] = await db.update(events).set(updates).where(eq(events.id, id)).returning();
    return event;
  }

  async deleteEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.delete(events).where(eq(events.id, id)).returning();
    return event;
  }
}

export const storage = new DatabaseStorage();
