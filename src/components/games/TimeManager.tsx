import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Clock, DollarSign, ShoppingCart, AlertCircle } from "lucide-react";

interface GameState {
  money: number;
  inventory: number;
  customers: number;
  timeLeft: number;
  day: number;
}

export const TimeManager = () => {
  const [gameState, setGameState] = useState<GameState>({
    money: 50,
    inventory: 10,
    customers: 0,
    timeLeft: 60,
    day: 1,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isRunning || gameState.timeLeft <= 0) return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        const newTime = prev.timeLeft - 1;
        
        // Random customer arrives
        if (Math.random() > 0.6 && prev.inventory > 0) {
          return {
            ...prev,
            timeLeft: newTime,
            customers: prev.customers + 1,
          };
        }
        
        return { ...prev, timeLeft: newTime };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, gameState.timeLeft]);

  useEffect(() => {
    if (gameState.timeLeft <= 0 && isRunning) {
      endDay();
    }
  }, [gameState.timeLeft, isRunning]);

  const buyInventory = () => {
    const cost = 5;
    const amount = 5;
    
    if (gameState.money >= cost) {
      setGameState((prev) => ({
        ...prev,
        money: prev.money - cost,
        inventory: prev.inventory + amount,
      }));
      toast.success(`Bought ${amount} lemonades for $${cost}!`);
    } else {
      toast.error("Not enough money!");
    }
  };

  const servCustomer = () => {
    if (gameState.customers > 0 && gameState.inventory > 0) {
      setGameState((prev) => ({
        ...prev,
        money: prev.money + 3,
        inventory: prev.inventory - 1,
        customers: prev.customers - 1,
      }));
      toast.success("Customer served! +$3");
    } else if (gameState.inventory === 0) {
      toast.error("No inventory! Buy more lemonade!");
    } else {
      toast.error("No customers waiting!");
    }
  };

  const startDay = () => {
    setIsRunning(true);
    setGameState((prev) => ({ ...prev, timeLeft: 60, customers: 0 }));
  };

  const endDay = () => {
    setIsRunning(false);
    const profit = gameState.money - 50;
    
    if (gameState.day >= 3) {
      setGameOver(true);
      const coinsEarned = Math.max(10, Math.floor(profit));
      const currentCoins = parseInt(localStorage.getItem("gameCoins") || "100");
      localStorage.setItem("gameCoins", String(currentCoins + coinsEarned));
      toast.success(`Game complete! Earned ${coinsEarned} coins!`);
    } else {
      toast.success(`Day ${gameState.day} complete! Profit: $${profit}`);
      setGameState((prev) => ({
        ...prev,
        day: prev.day + 1,
        timeLeft: 60,
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      money: 50,
      inventory: 10,
      customers: 0,
      timeLeft: 60,
      day: 1,
    });
    setIsRunning(false);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <Card className="p-8 bg-white/90 text-center">
        <h2 className="text-3xl font-bold mb-4">Stand Closed! 🍋</h2>
        <p className="text-xl mb-2">Final Money: ${gameState.money}</p>
        <p className="text-muted-foreground mb-6">
          You learned about managing time, inventory, and profit!
        </p>
        <Button onClick={resetGame} variant="game" size="lg">
          Start New Business
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/90">
      <h2 className="text-2xl font-bold mb-4">🍋 Lemonade Stand Rush</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Buy inventory, serve customers, and maximize profit! Learn about
        opportunity cost and resource management.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="font-semibold">Money</span>
          </div>
          <div className="text-2xl font-bold">${gameState.money}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">Inventory</span>
          </div>
          <div className="text-2xl font-bold">{gameState.inventory}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span className="font-semibold">Customers</span>
          </div>
          <div className="text-2xl font-bold">{gameState.customers}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="font-semibold">Time Left</span>
          </div>
          <div className="text-2xl font-bold">{gameState.timeLeft}s</div>
        </Card>
      </div>

      {/* Day Progress */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Day {gameState.day} / 3</span>
          <span className="text-sm text-muted-foreground">
            Time: {gameState.timeLeft}s
          </span>
        </div>
        <Progress value={(gameState.timeLeft / 60) * 100} />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button
          onClick={buyInventory}
          disabled={isRunning && gameState.money < 5}
          variant="outline"
        >
          Buy 5 Lemonades ($5)
        </Button>
        <Button
          onClick={servCustomer}
          disabled={!isRunning || gameState.customers === 0 || gameState.inventory === 0}
          variant="game"
        >
          Serve Customer (+$3)
        </Button>
      </div>

      {!isRunning && gameState.day <= 3 && (
        <Button onClick={startDay} className="w-full" variant="game" size="lg">
          Start Day {gameState.day}
        </Button>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
        <strong>💡 Tip:</strong> Buy inventory when it's low. Serve customers
        quickly before they leave. Balance spending and earning!
      </div>
    </Card>
  );
};
