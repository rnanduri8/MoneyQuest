import { Trophy, Target, Award, TrendingUp, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import GameHeader from "@/components/GameHeader";

interface MyWorldProps {
  coins: number;
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  completedZones: string[];
}

const allBadges = [
  { id: "first-steps", name: "First Steps", description: "Complete your first challenge", icon: "🎯", unlocked: true },
  { id: "budget-boss", name: "Budget Boss", description: "Complete Budget Bay challenge", icon: "💰", requirement: "budget-bay" },
  { id: "smart-saver", name: "Smart Saver", description: "Save 500 coins", icon: "🐷", requirement: 500 },
  { id: "streak-master", name: "Streak Master", description: "7 day streak", icon: "🔥", requirement: 7 },
  { id: "level-10", name: "Rising Star", description: "Reach level 10", icon: "⭐", requirement: 10 },
  { id: "investment-guru", name: "Investment Explorer", description: "Complete Investopolis", icon: "🌳", requirement: "investopolis" },
];

const goalMilestones = [
  { coins: 500, label: "Unlock Budget Bay", unlocked: false },
  { coins: 1000, label: "Unlock Investopolis", unlocked: false },
  { coins: 2000, label: "Unlock Credit Canyon", unlocked: false },
  { coins: 3500, label: "Unlock Entrepreneur Island", unlocked: false },
];

const MyWorld = ({ coins, xp, level, streak, badges = [], completedZones = [] }: MyWorldProps) => {
  const nextMilestone = goalMilestones.find(m => coins < m.coins);
  const progress = nextMilestone ? (coins / nextMilestone.coins) * 100 : 100;

  const isBadgeUnlocked = (badge: typeof allBadges[0]) => {
    if (badge.id === "first-steps") return true;
    if (typeof badge.requirement === "string") {
      return completedZones.includes(badge.requirement);
    }
    if (badge.id === "smart-saver") return coins >= 500;
    if (badge.id === "streak-master") return streak >= 7;
    if (badge.id === "level-10") return level >= 10;
    return false;
  };

  return (
    <div className="min-h-screen gradient-bg pb-6">
      <GameHeader coins={coins} xp={xp} level={level} streak={streak} />
      
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">My World</h1>
          <p className="text-muted-foreground text-base md:text-lg">Track your progress and achievements!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card className="p-4 md:p-6 text-center gradient-primary text-white">
            <div className="text-3xl md:text-4xl mb-2">💰</div>
            <div className="text-2xl md:text-3xl font-bold">{coins}</div>
            <div className="text-xs md:text-sm opacity-90">Total Coins</div>
          </Card>
          
          <Card className="p-4 md:p-6 text-center gradient-secondary text-white">
            <div className="text-3xl md:text-4xl mb-2">⚡</div>
            <div className="text-2xl md:text-3xl font-bold">{xp}</div>
            <div className="text-xs md:text-sm opacity-90">Total XP</div>
          </Card>
          
          <Card className="p-4 md:p-6 text-center gradient-success text-white">
            <div className="text-3xl md:text-4xl mb-2">🏆</div>
            <div className="text-2xl md:text-3xl font-bold">{level}</div>
            <div className="text-xs md:text-sm opacity-90">Level</div>
          </Card>
          
          <Card className="p-4 md:p-6 text-center bg-destructive/80 text-white">
            <div className="text-3xl md:text-4xl mb-2">🔥</div>
            <div className="text-2xl md:text-3xl font-bold">{streak}</div>
            <div className="text-xs md:text-sm opacity-90">Day Streak</div>
          </Card>
        </div>

        {/* Goal Tracker */}
        {nextMilestone && (
          <Card className="p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-bold text-foreground">Current Goal</h2>
                <p className="text-sm md:text-base text-muted-foreground">{nextMilestone.label}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-bold text-primary">{coins} / {nextMilestone.coins} coins</span>
              </div>
              <Progress value={progress} className="h-3 md:h-4" />
              <p className="text-xs md:text-sm text-muted-foreground text-center">
                {nextMilestone.coins - coins} coins to go! 🎯
              </p>
            </div>
          </Card>
        )}

        {/* Badges */}
        <Card className="p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <Award className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
            <h2 className="text-lg md:text-xl font-bold text-foreground">Badges Earned</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {allBadges.map((badge) => {
              const unlocked = isBadgeUnlocked(badge);
              return (
                <div
                  key={badge.id}
                  className={`p-3 md:p-4 rounded-lg border-2 text-center transition-all ${
                    unlocked
                      ? "border-primary bg-primary/5 shadow-game"
                      : "border-muted bg-muted/20 opacity-50"
                  }`}
                >
                  <div className={`text-3xl md:text-4xl mb-2 ${!unlocked && "grayscale"}`}>
                    {unlocked ? badge.icon : "🔒"}
                  </div>
                  <h3 className="font-bold text-xs md:text-sm text-foreground mb-1">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Completed Zones */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-accent" />
            <h2 className="text-lg md:text-xl font-bold text-foreground">Completed Zones</h2>
          </div>
          
          {completedZones.length > 0 ? (
            <div className="space-y-3">
              {completedZones.map((zone) => (
                <div key={zone} className="flex items-center gap-3 p-3 md:p-4 bg-accent/10 rounded-lg">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full gradient-success flex items-center justify-center text-xl md:text-2xl">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-foreground capitalize">
                      {zone.replace("-", " ")}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Completed!</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Lock className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-50" />
              <p className="text-sm md:text-base">Complete your first zone to see it here!</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MyWorld;
