import { PiggyBank, ShoppingCart, TrendingUp, Shield, Store, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AIQuestDialog from "./AIQuestDialog";

interface Zone {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  unlocked: boolean;
  progress: number;
}

interface WorldMapProps {
  onZoneClick: (zoneId: string) => void;
  playerLevel: number;
  onQuestComplete: (coins: number, xp: number) => void;
}

const financialConcepts: Record<string, string> = {
  "savings-city": "Saving money and delayed gratification",
  "budget-bay": "Budgeting and prioritizing needs vs wants",
  "investopolis": "Investing and compound interest",
  "credit-canyon": "Credit, trust, and financial responsibility",
  "entrepreneur-island": "Entrepreneurship and profit/loss",
};

const zones: Zone[] = [
  {
    id: "savings-city",
    name: "Savings City",
    description: "Build piggy banks and unlock upgrades!",
    icon: PiggyBank,
    color: "from-pink-400 to-pink-600",
    unlocked: true,
    progress: 30,
  },
  {
    id: "budget-bay",
    name: "Budget Bay",
    description: "Plan parties and learn trade-offs!",
    icon: ShoppingCart,
    color: "from-blue-400 to-blue-600",
    unlocked: false,
    progress: 0,
  },
  {
    id: "investopolis",
    name: "Investopolis",
    description: "Plant money trees and watch them grow!",
    icon: TrendingUp,
    color: "from-green-400 to-green-600",
    unlocked: false,
    progress: 0,
  },
  {
    id: "credit-canyon",
    name: "Credit Canyon",
    description: "Earn trust points by being responsible!",
    icon: Shield,
    color: "from-purple-400 to-purple-600",
    unlocked: false,
    progress: 0,
  },
  {
    id: "entrepreneur-island",
    name: "Entrepreneur Island",
    description: "Start your lemonade stand business!",
    icon: Store,
    color: "from-orange-400 to-orange-600",
    unlocked: false,
    progress: 0,
  },
];

const WorldMap = ({ onZoneClick, playerLevel, onQuestComplete }: WorldMapProps) => {
  const [showAIQuest, setShowAIQuest] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const handleAIQuestClick = (zone: Zone) => {
    setSelectedZone(zone);
    setShowAIQuest(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Explore the World</h1>
        <p className="text-muted-foreground text-base md:text-lg">Choose your next adventure!</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
        {zones.map((zone) => {
          const Icon = zone.icon;
          return (
            <Card
              key={zone.id}
              className={`relative overflow-hidden transition-all duration-300 ${
                zone.unlocked
                  ? "hover:scale-105 hover:shadow-lg cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              <div className={`h-24 md:h-32 bg-gradient-to-br ${zone.color} flex items-center justify-center`}>
                <Icon className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
              
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">{zone.name}</h3>
                <p className="text-muted-foreground text-xs md:text-sm mb-4">{zone.description}</p>
                
                {zone.unlocked ? (
                  <>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-bold text-primary">{zone.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-primary transition-all duration-500"
                          style={{ width: `${zone.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onZoneClick(zone.id)}
                        variant="game"
                        className="flex-1"
                      >
                        Enter Zone
                      </Button>
                      <Button
                        onClick={() => handleAIQuestClick(zone)}
                        variant="game-secondary"
                        size="sm"
                        className="px-3"
                        title="AI Story Quest"
                      >
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-2">
                    <span className="text-sm text-muted-foreground">🔒 Locked - Complete previous zones!</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {selectedZone && (
        <AIQuestDialog
          isOpen={showAIQuest}
          onClose={() => {
            setShowAIQuest(false);
            setSelectedZone(null);
          }}
          playerLevel={playerLevel}
          zoneName={selectedZone.name}
          financialConcept={financialConcepts[selectedZone.id]}
          onQuestComplete={onQuestComplete}
        />
      )}
    </div>
  );
};

export default WorldMap;
