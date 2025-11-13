import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertComplaintSchema,
  insertMessFeedbackSchema,
  insertVisitorSchema,
  insertLostFoundSchema,
  insertSOSAlertSchema,
  insertRoomSchema,
  insertUserSchema,
} from "@shared/schema";
import { fromError } from "zod-validation-error";
import multer from "multer";
import path from "path";

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storageConfig });

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password, role } = req.body;
      
      if (!username || !password || !role) {
        return res.status(400).json({ message: "Username, password, and role are required" });
      }

      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password || user.role !== role) {
        return res.status(401).json({ message: "Invalid credentials or role" });
      }

      res.json({ 
        id: user.id, 
        username: user.username, 
        role: user.role,
        name: user.name,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }

      const { username, email } = parsed.data;

      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const newUser = await storage.createUser(parsed.data);
      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        name: newUser.name,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Room routes
  app.get("/api/rooms", async (req, res) => {
    try {
      const rooms = await storage.getAllRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });

  app.get("/api/rooms/:id", async (req, res) => {
    try {
      const room = await storage.getRoom(req.params.id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch room" });
    }
  });

  app.post("/api/rooms", async (req, res) => {
    try {
      const parsed = insertRoomSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }
      const room = await storage.createRoom(parsed.data);
      res.status(201).json(room);
    } catch (error) {
      res.status(500).json({ message: "Failed to create room" });
    }
  });

  app.patch("/api/rooms/:id", async (req, res) => {
    try {
      const room = await storage.updateRoom(req.params.id, req.body);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Failed to update room" });
    }
  });

  // Complaint routes
  app.get("/api/complaints", async (req, res) => {
    try {
      const { userId } = req.query;
      const complaints = userId 
        ? await storage.getComplaintsByUser(userId as string)
        : await storage.getAllComplaints();
      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  });

  app.get("/api/complaints/:id", async (req, res) => {
    try {
      const complaint = await storage.getComplaint(req.params.id);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      res.json(complaint);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaint" });
    }
  });

  app.post("/api/complaints", async (req, res) => {
    try {
      const parsed = insertComplaintSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }
      const complaint = await storage.createComplaint(parsed.data);
      res.status(201).json(complaint);
    } catch (error) {
      res.status(500).json({ message: "Failed to create complaint" });
    }
  });

  app.patch("/api/complaints/:id", async (req, res) => {
    try {
      const complaint = await storage.updateComplaint(req.params.id, req.body);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      res.json(complaint);
    } catch (error) {
      res.status(500).json({ message: "Failed to update complaint" });
    }
  });

  app.delete("/api/complaints/:id", async (req, res) => {
    try {
      const complaint = await storage.deleteComplaint(req.params.id);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete complaint" });
    }
  });

  // Mess Feedback routes
  app.get("/api/mess-feedback", async (req, res) => {
    try {
      const { userId } = req.query;
      const feedback = userId 
        ? await storage.getMessFeedbackByUser(userId as string)
        : await storage.getAllMessFeedback();
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mess feedback" });
    }
  });

  app.post("/api/mess-feedback", async (req, res) => {
    try {
      const parsed = insertMessFeedbackSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }
      const feedback = await storage.createMessFeedback(parsed.data);
      res.status(201).json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to create mess feedback" });
    }
  });

  // Visitor routes
  app.get("/api/visitors", async (req, res) => {
    try {
      const { active } = req.query;
      const visitors = active === 'true'
        ? await storage.getActiveVisitors()
        : await storage.getAllVisitors();
      res.json(visitors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch visitors" });
    }
  });

  app.get("/api/visitors/:id", async (req, res) => {
    try {
      const visitor = await storage.getVisitor(req.params.id);
      if (!visitor) {
        return res.status(404).json({ message: "Visitor not found" });
      }
      res.json(visitor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch visitor" });
    }
  });

  app.post("/api/visitors", async (req, res) => {
    try {
      const parsed = insertVisitorSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }
      const visitor = await storage.createVisitor(parsed.data);
      res.status(201).json(visitor);
    } catch (error) {
      res.status(500).json({ message: "Failed to create visitor" });
    }
  });

  app.patch("/api/visitors/:id", async (req, res) => {
    try {
      const visitor = await storage.updateVisitor(req.params.id, req.body);
      if (!visitor) {
        return res.status(404).json({ message: "Visitor not found" });
      }
      res.json(visitor);
    } catch (error) {
      res.status(500).json({ message: "Failed to update visitor" });
    }
  });

  // Lost & Found routes
  app.get("/api/lost-found", async (req, res) => {
    try {
      const { type, active } = req.query;
      let items;
      
      if (type) {
        items = await storage.getLostFoundByType(type as string);
      } else if (active === 'true') {
        items = await storage.getActiveLostFound();
      } else {
        items = await storage.getAllLostFound();
      }
      
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lost & found items" });
    }
  });

  app.get("/api/lost-found/:id", async (req, res) => {
    try {
      const item = await storage.getLostFound(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch item" });
    }
  });

  app.post("/api/lost-found", upload.single('attachment'), async (req, res) => {
    try {
      const parsed = insertLostFoundSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }
      
      let attachmentUrl: string | undefined = undefined;
      if (req.file) {
        attachmentUrl = `/uploads/${req.file.filename}`;
      }

      const item = await storage.createLostFound({ ...parsed.data, attachmentUrl });
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to create lost & found item" });
    }
  });

  app.patch("/api/lost-found/:id", async (req, res) => {
    try {
      const item = await storage.updateLostFound(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to update item" });
    }
  });

  app.delete("/api/lost-found/:id", async (req, res) => {
    try {
      const item = await storage.deleteLostFound(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // SOS Alert routes
  app.get("/api/sos-alerts", async (req, res) => {
    try {
      const { active } = req.query;
      const alerts = active === 'true'
        ? await storage.getActiveSOSAlerts()
        : await storage.getAllSOSAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SOS alerts" });
    }
  });

  app.get("/api/sos-alerts/:id", async (req, res) => {
    try {
      const alert = await storage.getSOSAlert(req.params.id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alert" });
    }
  });

  app.post("/api/sos-alerts", async (req, res) => {
    try {
      const parsed = insertSOSAlertSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: fromError(parsed.error).toString() });
      }
      const alert = await storage.createSOSAlert(parsed.data);
      res.status(201).json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to create SOS alert" });
    }
  });

  app.patch("/api/sos-alerts/:id", async (req, res) => {
    try {
      const alert = await storage.updateSOSAlert(req.params.id, req.body);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to update alert" });
    }
  });

  // Analytics endpoint for admin dashboard
  app.get("/api/analytics", async (req, res) => {
    try {
      const complaints = await storage.getAllComplaints();
      const rooms = await storage.getAllRooms();
      const messFeedback = await storage.getAllMessFeedback();
      const sosAlerts = await storage.getAllSOSAlerts();
      const visitors = await storage.getAllVisitors();

      const analytics = {
        complaints: {
          total: complaints.length,
          pending: complaints.filter(c => c.status === 'pending').length,
          resolved: complaints.filter(c => c.status === 'resolved').length,
          byCategory: complaints.reduce((acc, c) => {
            acc[c.category] = (acc[c.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        },
        rooms: {
          total: rooms.length,
          available: rooms.filter(r => r.status === 'available').length,
          full: rooms.filter(r => r.status === 'full').length,
          maintenance: rooms.filter(r => r.status === 'maintenance').length,
          occupancyRate: (rooms.reduce((sum, r) => sum + r.occupied, 0) / rooms.reduce((sum, r) => sum + r.capacity, 0) * 100).toFixed(1),
        },
        mess: {
          totalFeedback: messFeedback.length,
          avgQuality: messFeedback.length > 0 
            ? (messFeedback.reduce((sum, f) => sum + f.qualityRating, 0) / messFeedback.length).toFixed(1)
            : '0',
          avgTaste: messFeedback.length > 0 
            ? (messFeedback.reduce((sum, f) => sum + f.tasteRating, 0) / messFeedback.length).toFixed(1)
            : '0',
          wastageReports: messFeedback.filter(f => f.wastage).length,
        },
        sos: {
          total: sosAlerts.length,
          active: sosAlerts.filter(a => a.status === 'active').length,
          resolved: sosAlerts.filter(a => a.status === 'resolved').length,
        },
        visitors: {
          total: visitors.length,
          active: visitors.filter(v => v.status === 'checked-in').length,
          checkedOut: visitors.filter(v => v.status === 'checked-out').length,
        },
      };

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
