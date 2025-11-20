import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface FAQ {
  keywords: string[];
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    keywords: ["complaint", "issue", "problem", "broken", "not working", "repair", "fix", "damage", "ac", "fan", "light", "door", "window", "bed", "table", "chair"],
    question: "How do I file a complaint?",
    answer: "Go to Dashboard → Click 'File Complaint' → Select category (Mess/Maintenance/Safety) → Add description and photo → Submit. Wardens will review within 24 hours."
  },
  {
    keywords: ["mess", "food", "feedback", "rating", "meal", "breakfast", "lunch", "dinner", "quality", "taste", "canteen", "dining", "kitchen"],
    question: "How do I rate mess food?",
    answer: "Navigate to Mess Feedback page → Select meal (Breakfast/Lunch/Dinner) → Rate quality (1-5 stars) → Rate taste (Good/Poor) → Report wastage if any → Submit."
  },
  {
    keywords: ["visitor", "guest", "entry", "pass", "parent", "friend", "relative", "visit", "meeting"],
    question: "How do I register a visitor?",
    answer: "Go to Visitors page → Click 'New Entry' → Enter visitor name, phone, purpose → Submit. Visitors are allowed 9 AM - 7 PM. Entry requires approval."
  },
  {
    keywords: ["room", "allotment", "allocation", "change room", "shift", "transfer", "roommate", "number", "where is my room"],
    question: "How do I check my room allocation?",
    answer: "Go to Rooms page → Your room number and details are displayed. For room change requests, contact warden through the Complaints section."
  },
  {
    keywords: ["sos", "emergency", "help", "urgent", "danger", "sick", "medical", "accident", "panic", "alert"],
    question: "How do I use SOS feature?",
    answer: "Click the red SOS button on Dashboard. This sends immediate alert to wardens with your location. Use only for genuine emergencies (medical, safety threats)."
  },
  {
    keywords: ["password", "reset", "forgot", "login", "can't login", "access", "sign in", "authentication"],
    question: "I forgot my password, what should I do?",
    answer: "On login page → Click 'Forgot password?' → Enter your email → Check email for reset link → Set new password. Link expires in 1 hour."
  },
  {
    keywords: ["meeting", "committee", "event", "announcement", "gathering", "schedule", "calendar"],
    question: "How do I view hostel meetings/events?",
    answer: "Go to Meetings page → See upcoming committee meetings, events, and announcements. Wardens can create new events."
  },
  {
    keywords: ["profile", "account", "personal info", "edit", "update", "change name", "details"],
    question: "How do I update my profile?",
    answer: "Click profile icon (top right) → View Profile → Edit your name, room number, or other details → Save changes."
  },
  {
    keywords: ["lost", "found", "missing", "item", "bag", "phone", "wallet", "keys", "laptop", "charger", "clothes", "book"],
    question: "How do I report lost items?",
    answer: "Go to Lost & Found → Click 'Report Lost Item' → Add item description and photo → Submit. Check regularly for found items posted by others."
  },
  {
    keywords: ["hours", "time", "timing", "when", "open", "close", "gate", "what time", "schedule"],
    question: "What are the hostel timings?",
    answer: "Gate closes at 10 PM on weekdays, 11 PM on weekends. Visitor hours: 9 AM - 7 PM. Mess timings: Breakfast 7-9 AM, Lunch 12-2 PM, Dinner 7-9 PM."
  },
  {
    keywords: ["warden", "contact", "admin", "staff", "authority", "incharge", "supervisor", "call", "reach"],
    question: "How do I contact the warden?",
    answer: "Use the Complaints section to send messages to wardens. For urgent matters, use the SOS button. Warden contact details are available in your registration email."
  },
  {
    keywords: ["app", "install", "download", "phone", "mobile", "home screen", "pwa", "application"],
    question: "How do I install this app on my phone?",
    answer: "On Android: Chrome menu → 'Add to Home screen'. On iPhone: Safari → Share button → 'Add to Home Screen'. The app works offline after installation!"
  },
  {
    keywords: ["how", "what", "where", "guide", "help", "tutorial", "instruction"],
    question: "What can you help me with?",
    answer: "I can help you with: Filing complaints, Rating mess food, Registering visitors, Room allocation, SOS emergencies, Password reset, Viewing meetings, Lost & Found, Hostel timings, and Contacting wardens. Just ask your question!"
  }
];

const quickActions = [
  "How do I file a complaint?",
  "How do I rate mess food?",
  "How do I use SOS?",
  "I forgot my password"
];

export default function HelpChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi! I'm your Hostel 360° assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");

  const findAnswer = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Exact question match
    const exactMatch = faqs.find(faq => 
      faq.question.toLowerCase() === lowerInput
    );
    if (exactMatch) return exactMatch.answer;
    
    // Calculate relevance score for each FAQ
    const scoredFAQs = faqs.map(faq => {
      let score = 0;
      const inputWords = lowerInput.split(' ').filter(word => word.length > 2);
      
      // Check how many keywords match
      faq.keywords.forEach(keyword => {
        if (lowerInput.includes(keyword.toLowerCase())) {
          score += 10; // Exact keyword match = high score
        }
      });
      
      // Check if question words match input
      inputWords.forEach(word => {
        if (faq.question.toLowerCase().includes(word)) {
          score += 3;
        }
        faq.keywords.forEach(keyword => {
          if (keyword.toLowerCase().includes(word) || word.includes(keyword.toLowerCase())) {
            score += 5; // Partial match
          }
        });
      });
      
      return { faq, score };
    });
    
    // Sort by score and get best match
    scoredFAQs.sort((a, b) => b.score - a.score);
    const bestMatch = scoredFAQs[0];
    
    if (bestMatch.score >= 5) {
      return bestMatch.faq.answer;
    }
    
    // No good match - show available topics
    return "I'm not sure about that. I can help you with:\n\n• Filing complaints\n• Rating mess food\n• Registering visitors\n• Room allocation\n• SOS emergencies\n• Password reset\n• Viewing meetings\n• Lost & Found items\n• Hostel timings\n• Contacting wardens\n\nTry asking one of these topics!";
  };

  const handleSend = (text?: string) => {
    const userMessage = text || input.trim();
    if (!userMessage) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userMessage,
      sender: "user",
      timestamp: new Date()
    };

    // Get bot response
    const botResponse = findAnswer(userMessage);
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: "bot",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const handleQuickAction = (action: string) => {
    handleSend(action);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
        aria-label="Open help chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-[350px] max-w-[calc(100vw-2rem)] shadow-2xl">
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">Help Assistant</h3>
              <p className="text-xs opacity-90">Always here to help</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-3 bg-muted/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs text-muted-foreground text-center">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <Badge
                    key={action}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleQuickAction(action)}
                  >
                    {action}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t bg-background flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your question..."
            className="flex-1"
          />
          <Button
            onClick={() => handleSend()}
            size="icon"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
