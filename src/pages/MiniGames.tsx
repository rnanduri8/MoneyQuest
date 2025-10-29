import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Puzzle, Coins, Clock } from "lucide-react";
import { BudgetPuzzle } from "@/components/games/BudgetPuzzle";
import { SwipeToEarn } from "@/components/games/SwipeToEarn";
import { TimeManager } from "@/components/games/TimeManager";

const MiniGames = () => {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games = [
    {
      id: "budget-puzzle",
      name: "Budget Puzzle",
      description: "Match items to their correct budget categories",
      icon: Puzzle,
      concept: "Categorizing expenses",
      component: BudgetPuzzle,
    },
    {
      id: "swipe-earn",
      name: "Swipe to Earn",
      description: "Swipe right on smart money choices!",
      icon: Coins,
      concept: "Financial decision-making",
      component: SwipeToEarn,
    },
    {
      id: "time-manager",
      name: "Lemonade Stand Rush",
      description: "Manage your time and resources wisely",
      icon: Clock,
      concept: "Resource management & opportunity cost",
      component: TimeManager,
    },
  ];

  const activeGameData = games.find((g) => g.id === activeGame);

  return (
    <div className="min-h-screen gradient-primary p-6">
      <Button
        onClick={() => (activeGame ? setActiveGame(null) : navigate("/"))}
        variant="outline"
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {activeGame ? "Back to Games" : "Back to World"}
      </Button>

      {!activeGame ? (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            Mini-Games Arena
          </h1>
          <div className="grid md:grid-cols-3 gap-6">
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <Card
                  key={game.id}
                  className="p-6 hover-scale cursor-pointer bg-white/90"
                  onClick={() => setActiveGame(game.id)}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{game.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {game.description}
                    </p>
                    <div className="text-xs px-3 py-1 bg-game-accent/20 rounded-full">
                      Teaches: {game.concept}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {activeGameData && <activeGameData.component />}
        </div>
      )}
    </div>
  );
};

export default MiniGames;
