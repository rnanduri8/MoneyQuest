import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  zoneName: string;
  storyText: string;
  emoji: string;
}

const StoryModal = ({ isOpen, onClose, zoneName, storyText, emoji }: StoryModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <div className="py-6">
          <div className="text-7xl md:text-8xl text-center mb-6 animate-pop-in">
            {emoji}
          </div>
          
          <Card className="p-6 md:p-8 gradient-primary text-white mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              Welcome to {zoneName}!
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              {storyText}
            </p>
          </Card>
          
          <Button 
            onClick={onClose}
            variant="game"
            size="lg"
            className="w-full"
          >
            Start Adventure!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryModal;
