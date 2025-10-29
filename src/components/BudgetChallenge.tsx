import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Check, X } from "lucide-react";
import { toast } from "sonner";

interface Item {
  id: string;
  name: string;
  cost: number;
  category: "need" | "want";
}

const items: Item[] = [
  { id: "1", name: "Birthday Cake", cost: 15, category: "need" },
  { id: "2", name: "Decorations", cost: 10, category: "need" },
  { id: "3", name: "Games & Activities", cost: 8, category: "need" },
  { id: "4", name: "Party Favors", cost: 12, category: "want" },
  { id: "5", name: "Photo Booth Props", cost: 7, category: "want" },
  { id: "6", name: "DJ/Music", cost: 20, category: "want" },
];

interface BudgetChallengeProps {
  onComplete: (earned: number) => void;
}

const BudgetChallenge = ({ onComplete }: BudgetChallengeProps) => {
  const [budget] = useState(50);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);

  const totalCost = Array.from(selectedItems).reduce((sum, id) => {
    const item = items.find((i) => i.id === id);
    return sum + (item?.cost || 0);
  }, 0);

  const remainingBudget = budget - totalCost;

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSubmit = () => {
    setShowResult(true);
    
    const hasAllNeeds = items
      .filter((item) => item.category === "need")
      .every((item) => selectedItems.has(item.id));

    if (remainingBudget >= 0 && hasAllNeeds) {
      const coinsEarned = Math.floor(remainingBudget) + 20;
      toast.success(`Great job! You earned ${coinsEarned} coins!`);
      setTimeout(() => onComplete(coinsEarned), 1500);
    } else if (remainingBudget < 0) {
      toast.error("Oops! You went over budget. Try removing some items!");
      setTimeout(() => setShowResult(false), 2000);
    } else {
      toast.error("Don't forget the essentials! Add all the 'needs' items.");
      setTimeout(() => setShowResult(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      <Card className="p-4 md:p-6 mb-4 md:mb-6 gradient-primary text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Birthday Party Challenge</h2>
        <p className="text-sm md:text-lg">Plan a party with ${budget}! Choose wisely between needs and wants.</p>
      </Card>

      <div className="grid grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-6">
        <Card className="p-3 md:p-6 text-center">
          <div className="text-2xl md:text-4xl font-bold text-primary">${budget}</div>
          <div className="text-xs md:text-sm text-muted-foreground">Budget</div>
        </Card>
        
        <Card className="p-3 md:p-6 text-center">
          <div className="text-2xl md:text-4xl font-bold text-secondary-foreground">${totalCost}</div>
          <div className="text-xs md:text-sm text-muted-foreground">Spent</div>
        </Card>
        
        <Card className={`p-3 md:p-6 text-center ${remainingBudget < 0 ? "bg-destructive/10" : "bg-accent/10"}`}>
          <div className={`text-2xl md:text-4xl font-bold ${remainingBudget < 0 ? "text-destructive" : "text-accent"}`}>
            ${remainingBudget}
          </div>
          <div className="text-xs md:text-sm text-muted-foreground">Left</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        {items.map((item) => {
          const isSelected = selectedItems.has(item.id);
          return (
              <Card
              key={item.id}
              className={`p-3 md:p-4 cursor-pointer transition-all ${
                isSelected ? "border-primary border-2 shadow-game" : "hover:shadow-md"
              }`}
              onClick={() => toggleItem(item.id)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "gradient-primary" : "bg-muted"
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    ) : (
                      <X className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm md:text-base text-foreground truncate">{item.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 md:py-1 rounded-full inline-block ${
                        item.category === "need"
                          ? "bg-accent/20 text-accent-foreground"
                          : "bg-secondary/20 text-secondary-foreground"
                      }`}
                    >
                      {item.category === "need" ? "Need" : "Want"}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 font-bold text-base md:text-lg flex-shrink-0">
                  <Coins className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
                  <span>${item.cost}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={showResult || selectedItems.size === 0}
        variant="game"
        size="lg"
        className="w-full text-base md:text-lg py-4 md:py-6"
      >
        {showResult ? "Checking..." : "Complete Party Plan!"}
      </Button>
    </div>
  );
};

export default BudgetChallenge;
