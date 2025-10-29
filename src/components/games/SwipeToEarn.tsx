import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ThumbsUp, ThumbsDown, Coins } from "lucide-react";

interface Scenario {
  id: string;
  text: string;
  isGoodChoice: boolean;
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    id: "1",
    text: "Buy a $200 phone when yours works fine",
    isGoodChoice: false,
    explanation: "Your current phone works! Save that money instead.",
  },
  {
    id: "2",
    text: "Put 20% of your allowance in savings",
    isGoodChoice: true,
    explanation: "Great! Building savings is a smart habit.",
  },
  {
    id: "3",
    text: "Buy snacks every day at school",
    isGoodChoice: false,
    explanation: "Daily small purchases add up! Pack snacks instead.",
  },
  {
    id: "4",
    text: "Compare prices before buying",
    isGoodChoice: true,
    explanation: "Smart shopping! This helps you find the best deals.",
  },
  {
    id: "5",
    text: "Use all your money on trending items",
    isGoodChoice: false,
    explanation: "Trends change! Save some money for the future.",
  },
  {
    id: "6",
    text: "Track where your money goes each week",
    isGoodChoice: true,
    explanation: "Excellent! Tracking spending builds awareness.",
  },
  {
    id: "7",
    text: "Borrow money to buy toys",
    isGoodChoice: false,
    explanation: "Debt for wants isn't wise. Save up instead!",
  },
  {
    id: "8",
    text: "Set a goal before spending",
    isGoodChoice: true,
    explanation: "Perfect! Having goals guides smart decisions.",
  },
];

export const SwipeToEarn = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const currentScenario = scenarios[currentIndex];

  const handleChoice = (choice: boolean) => {
    const isCorrect = choice === currentScenario.isGoodChoice;
    
    if (isCorrect) {
      const points = 10 + streak * 2;
      setScore((s) => s + points);
      setStreak((s) => s + 1);
      toast.success(`Correct! +${points} points! 🎉`);
    } else {
      setStreak(0);
      toast.error(currentScenario.explanation);
    }

    if (currentIndex < scenarios.length - 1) {
      setTimeout(() => setCurrentIndex((i) => i + 1), 1500);
    } else {
      setGameOver(true);
      const coinsEarned = Math.floor(score / 3);
      const currentCoins = parseInt(localStorage.getItem("gameCoins") || "100");
      localStorage.setItem("gameCoins", String(currentCoins + coinsEarned));
      toast.success(`Game complete! Earned ${coinsEarned} coins!`);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <Card className="p-8 bg-white/90 text-center">
        <h2 className="text-3xl font-bold mb-4">Great Job! 🎉</h2>
        <p className="text-xl mb-2">Final Score: {score}</p>
        <p className="text-muted-foreground mb-6">
          You're learning to make smart money choices!
        </p>
        <Button onClick={resetGame} variant="game" size="lg">
          <Coins className="w-5 h-5 mr-2" />
          Play Again
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-2xl font-bold">Score: {score}</div>
            <div className="text-sm text-muted-foreground">
              Streak: {streak} 🔥
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {currentIndex + 1} / {scenarios.length}
          </div>
        </div>

        <Card className="p-8 mb-6 min-h-[200px] flex items-center justify-center bg-gradient-primary text-white">
          <p className="text-xl text-center font-semibold">
            {currentScenario.text}
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleChoice(false)}
            variant="destructive"
            size="lg"
            className="h-20"
          >
            <ThumbsDown className="w-6 h-6 mr-2" />
            Bad Choice
          </Button>
          <Button
            onClick={() => handleChoice(true)}
            variant="game"
            size="lg"
            className="h-20"
          >
            <ThumbsUp className="w-6 h-6 mr-2" />
            Good Choice
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Swipe left for bad choices, right for good choices!
        </p>
      </Card>
    </div>
  );
};
