import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PennyMascotProps {
  message: string;
  onClose: () => void;
}

const PennyMascot = ({ message, onClose }: PennyMascotProps) => {
  return (
    <Card className="fixed bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto md:max-w-sm shadow-lg animate-pop-in z-40">
      <div className="p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 gradient-primary rounded-full flex items-center justify-center text-3xl md:text-4xl flex-shrink-0 shadow-game animate-bounce-soft">
            🐧
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm md:text-base text-foreground truncate">Penny the Penguin</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 flex-shrink-0 ml-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PennyMascot;
