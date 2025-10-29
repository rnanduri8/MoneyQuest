import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameHeader from "@/components/GameHeader";
import WorldMap from "@/components/WorldMap";
import BudgetChallenge from "@/components/BudgetChallenge";
import PennyMascot from "@/components/PennyMascot";
import DailyReward from "@/components/DailyReward";
import StoryModal from "@/components/StoryModal";
import { Button } from "@/components/ui/button";
import { Gamepad2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("gameCoins");
    return saved ? parseInt(saved) : 100;
  });
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem("gameXp");
    return saved ? parseInt(saved) : 0;
  });
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem("gameLevel");
    return saved ? parseInt(saved) : 1;
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("gameStreak");
    return saved ? parseInt(saved) : 0;
  });
  const [completedZones, setCompletedZones] = useState<string[]>(() => {
    const saved = localStorage.getItem("completedZones");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentView, setCurrentView] = useState<"map" | "savings-city">("map");
  const [showMascot, setShowMascot] = useState(true);
  const [showStory, setShowStory] = useState(false);
  const [currentStory, setCurrentStory] = useState({
    zoneName: "",
    storyText: "",
    emoji: "",
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("gameCoins", coins.toString());
    localStorage.setItem("gameXp", xp.toString());
    localStorage.setItem("gameLevel", level.toString());
    localStorage.setItem("gameStreak", streak.toString());
    localStorage.setItem("completedZones", JSON.stringify(completedZones));
  }, [coins, xp, level, streak, completedZones]);

  // Check daily streak
  useEffect(() => {
    const lastVisit = localStorage.getItem("lastVisit");
    const now = new Date().getTime();
    
    if (lastVisit) {
      const hoursSinceLastVisit = (now - parseInt(lastVisit)) / (1000 * 60 * 60);
      if (hoursSinceLastVisit >= 24 && hoursSinceLastVisit < 48) {
        setStreak(prev => prev + 1);
        toast.success(`🔥 ${streak + 1} day streak!`);
      } else if (hoursSinceLastVisit >= 48) {
        setStreak(0);
      }
    }
    
    localStorage.setItem("lastVisit", now.toString());
  }, []);

  const handleZoneClick = (zoneId: string) => {
    if (zoneId === "savings-city") {
      // Show story modal before entering
      setCurrentStory({
        zoneName: "Savings City",
        storyText: "Penny the Penguin needs your help! The city's birthday party fund is a mess. Can you help plan the perfect party while staying within budget? Learn to balance needs and wants!",
        emoji: "🏙️",
      });
      setShowStory(true);
      setShowMascot(false);
    }
  };

  const handleStoryClose = () => {
    setShowStory(false);
    setCurrentView("savings-city");
    setShowMascot(true);
  };

  const handleChallengeComplete = (earnedCoins: number) => {
    setCoins((prev) => prev + earnedCoins);
    setXp((prev) => {
      const newXp = prev + 50;
      if (newXp >= level * 100) {
        setLevel((l) => l + 1);
        toast.success(`🎉 Level Up! You're now level ${level + 1}!`);
      }
      return newXp;
    });
    
    // Mark zone as completed
    if (!completedZones.includes("savings-city")) {
      setCompletedZones(prev => [...prev, "savings-city"]);
      toast.success("🏆 Savings City completed!");
    }
    
    setTimeout(() => {
      setCurrentView("map");
      setShowMascot(true);
    }, 2000);
  };

  const handleDailyReward = (rewardCoins: number, rewardXp: number) => {
    setCoins(prev => prev + rewardCoins);
    setXp(prev => {
      const newXp = prev + rewardXp;
      if (newXp >= level * 100) {
        setLevel(l => l + 1);
        toast.success(`🎉 Level Up! You're now level ${level + 1}!`);
      }
      return newXp;
    });
  };

  const getMascotMessage = () => {
    if (currentView === "map") {
      return "Welcome to Money Quest! 🎮 Start your adventure in Savings City and learn how to become a money master!";
    }
    return "Your mission: Plan the perfect birthday party! Remember to balance needs vs wants and stay under budget. Good luck! 🎉";
  };

  return (
    <div className="min-h-screen gradient-bg">
      <GameHeader coins={coins} xp={xp} level={level} streak={streak} />
      
      <div className="container mx-auto px-4 py-4">
        <Button
          onClick={() => navigate("/mini-games")}
          variant="game"
          size="lg"
          className="w-full md:w-auto shadow-game"
        >
          <Gamepad2 className="w-5 h-5 mr-2" />
          Play Mini-Games
        </Button>
      </div>
      
      <main className="pb-20 md:pb-6">
        {currentView === "map" ? (
          <WorldMap 
            onZoneClick={handleZoneClick}
            playerLevel={level}
            onQuestComplete={handleDailyReward}
          />
        ) : (
          <BudgetChallenge onComplete={handleChallengeComplete} />
        )}
      </main>

      {showMascot && (
        <PennyMascot
          message={getMascotMessage()}
          onClose={() => setShowMascot(false)}
        />
      )}

      <DailyReward onClaimReward={handleDailyReward} />

      <StoryModal
        isOpen={showStory}
        onClose={handleStoryClose}
        zoneName={currentStory.zoneName}
        storyText={currentStory.storyText}
        emoji={currentStory.emoji}
      />
    </div>
  );
};

export default Index;
