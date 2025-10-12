import { Star, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const mealTypes = ["Breakfast", "Lunch", "Dinner"];

export default function MessFeedback() {
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [taste, setTaste] = useState<"good" | "bad" | null>(null);
  const [wastage, setWastage] = useState<"yes" | "no" | null>(null);

  const handleSubmit = () => {
    console.log('Feedback submitted:', { selectedMeal, rating, taste, wastage });
    setRating(0);
    setTaste(null);
    setWastage(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-30">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold">Mess Feedback</h1>
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto space-y-6">
        <Card className="overflow-visible">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Select Meal</h3>
            <div className="flex gap-2">
              {mealTypes.map((meal) => (
                <Button
                  key={meal}
                  onClick={() => setSelectedMeal(meal)}
                  variant={selectedMeal === meal ? "default" : "outline"}
                  data-testid={`button-meal-${meal.toLowerCase()}`}
                  className="flex-1"
                >
                  {meal}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="overflow-visible">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Rate Quality</h3>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  data-testid={`button-star-${star}`}
                  className="p-2 hover-elevate active-elevate-2 rounded-md"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-warning text-warning"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="overflow-visible">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Taste</h3>
            <div className="flex gap-3">
              <Button
                onClick={() => setTaste("good")}
                variant={taste === "good" ? "default" : "outline"}
                data-testid="button-taste-good"
                className="flex-1 gap-2"
              >
                <ThumbsUp className="w-5 h-5" />
                Good
              </Button>
              <Button
                onClick={() => setTaste("bad")}
                variant={taste === "bad" ? "destructive" : "outline"}
                data-testid="button-taste-bad"
                className="flex-1 gap-2"
              >
                <ThumbsDown className="w-5 h-5" />
                Poor
              </Button>
            </div>
          </div>
        </Card>

        <Card className="overflow-visible">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Food Wastage?</h3>
            <div className="flex gap-3">
              <Button
                onClick={() => setWastage("no")}
                variant={wastage === "no" ? "default" : "outline"}
                data-testid="button-wastage-no"
                className="flex-1"
              >
                No
              </Button>
              <Button
                onClick={() => setWastage("yes")}
                variant={wastage === "yes" ? "destructive" : "outline"}
                data-testid="button-wastage-yes"
                className="flex-1 gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Yes
              </Button>
            </div>
          </div>
        </Card>

        <Button
          onClick={handleSubmit}
          data-testid="button-submit-feedback"
          className="w-full"
          size="lg"
        >
          Submit Feedback
        </Button>
      </div>
    </div>
  );
}
