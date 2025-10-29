import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

type Category = "needs" | "wants" | "savings";

interface Item {
  id: string;
  name: string;
  correctCategory: Category;
  emoji: string;
}

const items: Item[] = [
  { id: "1", name: "Groceries", correctCategory: "needs", emoji: "🛒" },
  { id: "2", name: "Video Game", correctCategory: "wants", emoji: "🎮" },
  { id: "3", name: "Rent", correctCategory: "needs", emoji: "🏠" },
  { id: "4", name: "Emergency Fund", correctCategory: "savings", emoji: "🏦" },
  { id: "5", name: "Concert Ticket", correctCategory: "wants", emoji: "🎵" },
  { id: "6", name: "Medicine", correctCategory: "needs", emoji: "💊" },
  { id: "7", name: "Vacation Fund", correctCategory: "savings", emoji: "✈️" },
  { id: "8", name: "Designer Shoes", correctCategory: "wants", emoji: "👟" },
];

export const BudgetPuzzle = () => {
  const [shuffledItems, setShuffledItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Record<Category, Item[]>>({
    needs: [],
    wants: [],
    savings: [],
  });
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    setShuffledItems([...items].sort(() => Math.random() - 0.5));
  }, []);

  const handleDrop = (item: Item, category: Category) => {
    const isCorrect = item.correctCategory === category;
    
    setCategories((prev) => ({
      ...prev,
      [category]: [...prev[category], item],
    }));

    setShuffledItems((prev) => prev.filter((i) => i.id !== item.id));

    if (isCorrect) {
      setScore((s) => s + 10);
      toast.success(`Correct! ${item.name} is a ${category}!`);
    } else {
      toast.error(`Oops! ${item.name} should go in ${item.correctCategory}`);
    }

    if (shuffledItems.length === 1) {
      setGameComplete(true);
      const coinsEarned = Math.floor(score / 2);
      const currentCoins = parseInt(localStorage.getItem("gameCoins") || "100");
      localStorage.setItem("gameCoins", String(currentCoins + coinsEarned));
      toast.success(`Game complete! Earned ${coinsEarned} coins! 🎉`);
    }
  };

  const resetGame = () => {
    setShuffledItems([...items].sort(() => Math.random() - 0.5));
    setCategories({ needs: [], wants: [], savings: [] });
    setScore(0);
    setGameComplete(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Budget Puzzle</h2>
          <div className="text-xl font-bold text-game-primary">
            Score: {score}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Drag items to their correct budget category: Needs, Wants, or Savings
        </p>

        {/* Items to sort */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Items to Sort:</h3>
          <div className="flex flex-wrap gap-2">
            {shuffledItems.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                className="text-lg"
                onClick={() => {
                  // Simple click-based sorting for mobile-friendly gameplay
                  const category = prompt(
                    `Where does "${item.name}" belong? Type: needs, wants, or savings`
                  )?.toLowerCase() as Category;
                  if (category && ["needs", "wants", "savings"].includes(category)) {
                    handleDrop(item, category);
                  }
                }}
              >
                {item.emoji} {item.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-3 gap-4">
          {(["needs", "wants", "savings"] as Category[]).map((category) => (
            <Card
              key={category}
              className={`p-4 min-h-[150px] ${
                category === "needs"
                  ? "border-green-500"
                  : category === "wants"
                  ? "border-yellow-500"
                  : "border-blue-500"
              } border-2`}
            >
              <h4 className="font-bold capitalize mb-2 text-center">
                {category}
              </h4>
              <div className="space-y-2">
                {categories[category].map((item) => (
                  <div
                    key={item.id}
                    className="text-sm p-2 bg-white rounded shadow"
                  >
                    {item.emoji} {item.name}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {gameComplete && (
          <Button onClick={resetGame} className="w-full mt-6" variant="game">
            <Sparkles className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        )}
      </Card>
    </div>
  );
};
