import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, Coins, Zap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Quest {
  title: string;
  story: string;
  financialLesson: string;
  choices: Array<{
    text: string;
    outcome: string;
    coinsReward: number;
    xpReward: number;
    lessonTaught: string;
  }>;
}

interface AIQuestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playerLevel: number;
  zoneName: string;
  financialConcept: string;
  onQuestComplete: (coins: number, xp: number) => void;
}

const AIQuestDialog = ({
  isOpen,
  onClose,
  playerLevel,
  zoneName,
  financialConcept,
  onQuestComplete,
}: AIQuestDialogProps) => {
  const [quest, setQuest] = useState<Quest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);

  const generateQuest = async () => {
    setIsLoading(true);
    setQuest(null);
    setSelectedChoice(null);
    setShowOutcome(false);

    try {
      const { data, error } = await supabase.functions.invoke('generate-quest', {
        body: {
          playerLevel,
          zoneName,
          financialConcept,
        },
      });

      if (error) throw error;

      console.log('Quest generated:', data);
      setQuest(data);
    } catch (error) {
      console.error('Error generating quest:', error);
      toast.error("Failed to generate quest. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoiceSelect = (index: number) => {
    if (showOutcome) return;
    setSelectedChoice(index);
    setShowOutcome(true);

    const choice = quest!.choices[index];
    setTimeout(() => {
      onQuestComplete(choice.coinsReward, choice.xpReward);
      toast.success(`+${choice.coinsReward} coins, +${choice.xpReward} XP!`);
      onClose();
    }, 3000);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setQuest(null);
      setSelectedChoice(null);
      setShowOutcome(false);
    }
    if (!open) onClose();
    if (open && !quest && !isLoading) generateQuest();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            AI Story Quest
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">
              Creating your personalized adventure...
            </p>
          </div>
        )}

        {quest && !isLoading && (
          <div className="space-y-6">
            <Card className="p-4 md:p-6 gradient-primary text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-3">{quest.title}</h3>
              <p className="text-sm md:text-base leading-relaxed mb-4">{quest.story}</p>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-xs md:text-sm font-semibold">
                  💡 Financial Lesson: {quest.financialLesson}
                </p>
              </div>
            </Card>

            <div className="space-y-3 md:space-y-4">
              <h4 className="font-bold text-base md:text-lg text-foreground">
                What will you do?
              </h4>

              {quest.choices.map((choice, index) => (
                <Card
                  key={index}
                  className={`p-4 md:p-5 cursor-pointer transition-all ${
                    selectedChoice === index
                      ? "border-primary border-2 shadow-lg"
                      : "hover:shadow-md hover:border-primary/50"
                  } ${showOutcome && selectedChoice !== index ? "opacity-50" : ""}`}
                  onClick={() => handleChoiceSelect(index)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <p className="flex-1 font-semibold text-sm md:text-base text-foreground">
                      {choice.text}
                    </p>
                  </div>

                  {showOutcome && selectedChoice === index && (
                    <div className="mt-4 pt-4 border-t space-y-3 animate-pop-in">
                      <div className="bg-accent/10 p-3 md:p-4 rounded-lg">
                        <p className="text-xs md:text-sm text-foreground mb-2">
                          <strong>What happened:</strong>
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {choice.outcome}
                        </p>
                      </div>

                      <div className="bg-success/10 p-3 md:p-4 rounded-lg">
                        <p className="text-xs md:text-sm text-foreground mb-2">
                          <strong>💡 Lesson Learned:</strong>
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {choice.lessonTaught}
                        </p>
                      </div>

                      <div className="flex gap-4 justify-center pt-2">
                        <div className="flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-full">
                          <Coins className="w-5 h-5 text-secondary" />
                          <span className="font-bold text-foreground">
                            +{choice.coinsReward}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full">
                          <Zap className="w-5 h-5 text-primary" />
                          <span className="font-bold text-foreground">
                            +{choice.xpReward}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {!showOutcome && (
              <Button
                onClick={generateQuest}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate New Quest
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIQuestDialog;
