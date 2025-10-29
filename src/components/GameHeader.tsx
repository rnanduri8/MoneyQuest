import { Coins, Home, Trophy, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

interface GameHeaderProps {
  coins: number;
  xp: number;
  level: number;
  streak: number;
}

const GameHeader = ({ coins, xp, level, streak }: GameHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const xpForNextLevel = level * 100;
  const xpProgress = (xp / xpForNextLevel) * 100;

  return (
    <Card className="sticky top-0 z-50 shadow-game">
      <div className="p-3 md:p-4">
        {/* Top Row - Stats */}
        <div className="flex items-center justify-between gap-2 md:gap-4 mb-3 md:mb-0">
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            <div className="gradient-primary text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-bold text-base md:text-lg shadow-game flex-shrink-0">
              {level}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs md:text-sm font-bold text-foreground truncate">Level {level}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{xp}/{xpForNextLevel}</span>
              </div>
              <Progress value={xpProgress} className="h-2" />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {streak > 0 && (
              <div className="hidden sm:flex items-center gap-1 bg-destructive/20 px-2 md:px-3 py-1 md:py-2 rounded-full">
                <Flame className="w-4 h-4 text-destructive" />
                <span className="font-bold text-xs md:text-sm text-foreground">{streak}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1 md:gap-2 bg-secondary/20 px-2 md:px-4 py-1 md:py-2 rounded-full">
              <Coins className="w-4 h-4 md:w-5 md:h-5 text-secondary shadow-coin" />
              <span className="font-bold text-xs md:text-base text-foreground">{coins}</span>
            </div>
          </div>
        </div>

        {/* Navigation Row - Only show on mobile */}
        <div className="flex md:hidden gap-2 border-t pt-3 -mx-3 px-3">
          <Button
            variant={location.pathname === "/" ? "game" : "outline"}
            size="sm"
            className="flex-1 h-9"
            onClick={() => navigate("/")}
          >
            <Home className="w-4 h-4 mr-1" />
            <span className="text-xs">Map</span>
          </Button>
          
          <Button
            variant={location.pathname === "/my-world" ? "game" : "outline"}
            size="sm"
            className="flex-1 h-9"
            onClick={() => navigate("/my-world")}
          >
            <Trophy className="w-4 h-4 mr-1" />
            <span className="text-xs">My World</span>
          </Button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2 mt-3 border-t pt-3">
          <Button
            variant={location.pathname === "/" ? "game" : "outline"}
            size="sm"
            onClick={() => navigate("/")}
          >
            <Home className="w-4 h-4 mr-2" />
            World Map
          </Button>
          
          <Button
            variant={location.pathname === "/my-world" ? "game" : "outline"}
            size="sm"
            onClick={() => navigate("/my-world")}
          >
            <Trophy className="w-4 h-4 mr-2" />
            My World
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GameHeader;
