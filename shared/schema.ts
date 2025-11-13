import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"),
  name: text("name"),
});

export const rooms = pgTable("rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  number: text("number").notNull().unique(),
  floor: integer("floor").notNull(),
  capacity: integer("capacity").notNull(),
  occupied: integer("occupied").notNull().default(0),
  status: text("status").notNull().default("available"),
});

export const complaints = pgTable("complaints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  priority: text("priority").notNull().default("medium"),
  roomNumber: text("room_number"),
  attachmentUrl: text("attachment_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const messFeedback = pgTable("mess_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  meal: text("meal").notNull(),
  qualityRating: integer("quality_rating").notNull(),
  tasteRating: integer("taste_rating").notNull(),
  wastage: boolean("wastage").notNull().default(false),
  comments: text("comments"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const visitors = pgTable("visitors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  purpose: text("purpose").notNull(),
  studentId: varchar("student_id").notNull(),
  studentName: text("student_name").notNull(),
  roomNumber: text("room_number").notNull(),
  checkIn: timestamp("check_in").notNull().defaultNow(),
  checkOut: timestamp("check_out"),
  status: text("status").notNull().default("checked-in"),
});

export const lostFound = pgTable("lost_found", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  itemName: text("item_name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  category: text("category").notNull(),
  reportedBy: varchar("reported_by").notNull(),
  reporterName: text("reporter_name").notNull(),
  contactInfo: text("contact_info").notNull(),
  attachmentUrl: text("attachment_url"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const sosAlerts = pgTable("sos_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  userName: text("user_name").notNull(),
  roomNumber: text("room_number"),
  location: text("location").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
});

export const insertComplaintSchema = z.object({
  userId: z.string(),
  category: z.string(),
  location: z.string(),
  description: z.string(),
  status: z.enum(["pending", "in-progress", "resolved", "rejected"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  roomNumber: z.string().optional(),
  attachmentUrl: z.string().url().optional(),
});

export const complaintSchema = insertComplaintSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  resolvedAt: z.date().nullable(),
});

export const insertMessFeedbackSchema = createInsertSchema(messFeedback).omit({
  id: true,
  createdAt: true,
});

export const insertVisitorSchema = createInsertSchema(visitors).omit({
  id: true,
  checkIn: true,
  checkOut: true,
});

export const insertLostFoundSchema = createInsertSchema(lostFound, {
  attachmentUrl: z.string().url().optional(),
}).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertSOSAlertSchema = createInsertSchema(sosAlerts).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof rooms.$inferSelect;

export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaints.$inferSelect;

export type InsertMessFeedback = z.infer<typeof insertMessFeedbackSchema>;
export type MessFeedback = typeof messFeedback.$inferSelect;

export type InsertVisitor = z.infer<typeof insertVisitorSchema>;
export type Visitor = typeof visitors.$inferSelect;

export type InsertLostFound = z.infer<typeof insertLostFoundSchema>;
export type LostFound = typeof lostFound.$inferSelect;

export type InsertSOSAlert = z.infer<typeof insertSOSAlertSchema>;
export type SOSAlert = typeof sosAlerts.$inferSelect;
