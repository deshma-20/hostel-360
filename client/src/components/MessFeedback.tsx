import { Star, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ProfileMenu from "./ProfileMenu";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const mealTypes = ["Breakfast", "Lunch", "Dinner"];

interface MessFeedback {
  id: string;
  userId: string;
  meal: string;
  qualityRating: number;
  tasteRating: number;
  wastage: boolean;
  createdAt: string;
}

export default function MessFeedback() {
  const [, setLocation] = useLocation();
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole') || 'student';
  
  useEffect(() => {
    if (!userId) {
      setLocation('/login');
    }
  }, [userId, setLocation]);

  if (!userId) {
    return null;
  }
  
  // If warden, show feedback submissions
  if (userRole === 'warden') {
    return <WardenMessView />;
  }
  
  // Student feedback form
  return <StudentMessView />;
}

function WardenMessView() {
  const { data: feedbacks = [], isLoading } = useQuery<MessFeedback[]>({
    queryKey: ["/api/mess-feedback"],
  });

  const groupedByMeal = feedbacks.reduce((acc, feedback) => {
    if (!acc[feedback.meal]) {
      acc[feedback.meal] = [];
    }
    acc[feedback.meal].push(feedback);
    return acc;
  }, {} as Record<string, MessFeedback[]>);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-bold">Mess Feedback Reports</h1>
            <p className="text-sm opacity-90">Student submissions</p>
          </div>
          <div>
            <ProfileMenu />
          </div>
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading feedback...</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No feedback submitted yet</p>
          </div>
        ) : (
          mealTypes.map((meal) => {
            const mealFeedbacks = groupedByMeal[meal] || [];
            if (mealFeedbacks.length === 0) return null;

            const avgQuality = mealFeedbacks.reduce((sum, f) => sum + f.qualityRating, 0) / mealFeedbacks.length;
            const avgTaste = mealFeedbacks.reduce((sum, f) => sum + f.tasteRating, 0) / mealFeedbacks.length;
            const wastageCount = mealFeedbacks.filter(f => f.wastage).length;

            return (
              <div key={meal} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{meal}</h3>
                  <Badge>{mealFeedbacks.length} responses</Badge>
                </div>

                {/* Summary Card */}
                <Card className="overflow-visible">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg Quality</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(avgQuality)
                                ? "fill-warning text-warning"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg Taste</span>
                      <Badge className={avgTaste >= 3 ? "bg-chart-3/10 text-chart-3" : "bg-destructive/10 text-destructive"}>
                        {avgTaste >= 3 ? "Good" : "Poor"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Wastage Reports</span>
                      <Badge className={wastageCount > 0 ? "bg-destructive/10 text-destructive" : "bg-chart-3/10 text-chart-3"}>
                        {wastageCount} / {mealFeedbacks.length}
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Individual Feedback Cards */}
                {mealFeedbacks.map((feedback) => (
                  <Card key={feedback.id} className="overflow-visible">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">
                          {new Date(feedback.createdAt).toLocaleDateString('en-GB')} • {new Date(feedback.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Quality</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= feedback.qualityRating
                                    ? "fill-warning text-warning"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Taste</span>
                          {feedback.tasteRating >= 3 ? (
                            <ThumbsUp className="w-4 h-4 text-chart-3" />
                          ) : (
                            <ThumbsDown className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Wastage</span>
                          {feedback.wastage ? (
                            <Trash2 className="w-4 h-4 text-destructive" />
                          ) : (
                            <span className="text-sm text-chart-3">No</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function StudentMessView() {
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");
  const [qualityRating, setQualityRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [tasteRating, setTasteRating] = useState<number | null>(null);
  const [wastage, setWastage] = useState<boolean | null>(null);
  const { toast } = useToast();
  const userId = localStorage.getItem('userId') || '';

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/mess-feedback", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mess-feedback"] });
      toast({
        title: "Success",
        description: "Feedback submitted successfully",
      });
      setQualityRating(0);
      setTasteRating(null);
      setWastage(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!qualityRating || tasteRating === null || wastage === null) {
      toast({
        title: "Error",
        description: "Please complete all fields",
        variant: "destructive",
      });
      return;
    }

    submitFeedbackMutation.mutate({
      userId,
      meal: selectedMeal,
      qualityRating,
      tasteRating,
      wastage,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-bold">Mess Feedback</h1>
            <p className="text-sm opacity-90">Rate your meals</p>
          </div>
          <div>
            <ProfileMenu />
          </div>
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
                  onClick={() => setQualityRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  data-testid={`button-star-${star}`}
                  className="p-2 hover-elevate active-elevate-2 rounded-md"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoveredRating || qualityRating)
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
                onClick={() => setTasteRating(5)}
                variant={tasteRating === 5 ? "default" : "outline"}
                data-testid="button-taste-good"
                className="flex-1 gap-2"
              >
                <ThumbsUp className="w-5 h-5" />
                Good
              </Button>
              <Button
                onClick={() => setTasteRating(1)}
                variant={tasteRating === 1 ? "destructive" : "outline"}
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
                onClick={() => setWastage(false)}
                variant={wastage === false ? "default" : "outline"}
                data-testid="button-wastage-no"
                className="flex-1"
              >
                No
              </Button>
              <Button
                onClick={() => setWastage(true)}
                variant={wastage === true ? "destructive" : "outline"}
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
          disabled={submitFeedbackMutation.isPending}
        >
          {submitFeedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
        </Button>
      </div>
    </div>
  );
}
