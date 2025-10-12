import { Plus, Search, MapPin, Clock, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Item {
  id: string;
  name: string;
  type: "lost" | "found";
  category: string;
  location: string;
  date: string;
  color?: string;
}

const mockItems: Item[] = [
  { id: "1", name: "Blue Water Bottle", type: "found", category: "Bottle", location: "Mess Hall", date: "2 hours ago", color: "Blue" },
  { id: "2", name: "Black Wallet", type: "lost", category: "Wallet", location: "Room 201", date: "5 hours ago", color: "Black" },
  { id: "3", name: "Red Notebook", type: "found", category: "Stationery", location: "Library", date: "1 day ago", color: "Red" },
  { id: "4", name: "White Earphones", type: "lost", category: "Electronics", location: "Common Room", date: "2 days ago", color: "White" },
];

export default function LostAndFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");

  const filteredItems = mockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 sticky top-0 z-30 shadow-lg">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold">Lost & Found</h1>
          <p className="text-sm opacity-90">Report and find items</p>
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search"
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            data-testid="filter-all"
            className="flex-1"
          >
            All
          </Button>
          <Button
            onClick={() => setFilter("lost")}
            variant={filter === "lost" ? "default" : "outline"}
            size="sm"
            data-testid="filter-lost"
            className="flex-1"
          >
            Lost
          </Button>
          <Button
            onClick={() => setFilter("found")}
            variant={filter === "found" ? "default" : "outline"}
            size="sm"
            data-testid="filter-found"
            className="flex-1"
          >
            Found
          </Button>
        </div>

        <Button
          data-testid="button-report-item"
          className="w-full gap-2"
          onClick={() => console.log('Report item')}
        >
          <Plus className="w-5 h-5" />
          Report Item
        </Button>

        <div className="space-y-3">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              data-testid={`item-card-${item.id}`}
              className="hover-elevate active-elevate-2 cursor-pointer overflow-visible"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Tag className="w-4 h-4" />
                      <span>{item.category}</span>
                    </div>
                  </div>
                  <Badge className={item.type === "lost" ? "bg-destructive/10 text-destructive" : "bg-chart-3/10 text-chart-3"}>
                    {item.type === "lost" ? "Lost" : "Found"}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
