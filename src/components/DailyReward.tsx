import { useState, useEffect } from "react";
import { Gift, Coins, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface DailyRewardProps {
  onClaimReward: (coins: number, xp: number) => void;
}

interface Reward {
  coins: number;
  xp: number;
  message: string;
}

const DailyReward = ({ onClaimReward }: DailyRewardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [showChest, setShowChest] = useState(false);

  useEffect(() => {
    checkDailyReward();
  }, []);

  const checkDailyReward = () => {
    const lastClaim = localStorage.getItem("lastDailyReward");
    const now = new Date().getTime();
    
    if (!lastClaim) {
      setCanClaim(true);
      setShowChest(true);
      return;
    }

    const lastClaimTime = parseInt(lastClaim);
    const hoursSinceLastClaim = (now - lastClaimTime) / (1000 * 60 * 60);
    
    if (hoursSinceLastClaim >= 24) {
      setCanClaim(true);
      setShowChest(true);
    }
  };

  const generateReward = (): Reward => {
    const rewards = [
      { coins: 50, xp: 25, message: "Nice! Found some coins!" },
      { coins: 75, xp: 30, message: "Great! A treasure trove!" },
      { coins: 100, xp: 50, message: "Jackpot! Big reward!" },
      { coins: 30, xp: 100, message: "XP Boost! Level up faster!" },
    ];
    return rewards[Math.floor(Math.random() * rewards.length)];
  };

  const handleClaimReward = () => {
    if (!canClaim) return;

    const newReward = generateReward();
    setReward(newReward);
    setIsOpen(true);
    
    localStorage.setItem("lastDailyReward", new Date().getTime().toString());
    setCanClaim(false);
    setShowChest(false);

    onClaimReward(newReward.coins, newReward.xp);
    toast.success(newReward.message);
  };

  if (!showChest) return null;

  return (
    <>
      <Button
        variant="game"
        size="lg"
        className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40 shadow-lg animate-bounce-soft rounded-full w-16 h-16 p-0"
        onClick={handleClaimReward}
      >
        <Gift className="w-8 h-8" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Daily Reward!</DialogTitle>
          </DialogHeader>
          
          {reward && (
            <div className="py-6">
              <div className="text-6xl text-center mb-4 animate-pop-in">🎁</div>
              
              <Card className="p-6 gradient-success text-white text-center mb-4">
                <p className="text-lg font-bold mb-4">{reward.message}</p>
                
                <div className="flex justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <Coins className="w-6 h-6" />
                    <span className="text-2xl font-bold">+{reward.coins}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Zap className="w-6 h-6" />
                    <span className="text-2xl font-bold">+{reward.xp}</span>
                  </div>
                </div>
              </Card>
              
              <p className="text-center text-sm text-muted-foreground">
                Come back tomorrow for another reward!
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DailyReward;
