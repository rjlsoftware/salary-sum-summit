
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";

interface StartStopButtonProps {
  isRunning: boolean;
  onClick: () => void;
}

const StartStopButton: React.FC<StartStopButtonProps> = ({ isRunning, onClick }) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant={isRunning ? "destructive" : "default"}
      className="w-full py-6 text-lg font-medium rounded-xl transition-all duration-300 hover:shadow-lg"
    >
      {isRunning ? (
        <>
          <Square className="mr-2 h-5 w-5" />
          Stop Meeting Timer
        </>
      ) : (
        <>
          <Play className="mr-2 h-5 w-5" />
          Start Meeting Timer
        </>
      )}
    </Button>
  );
};

export default StartStopButton;
