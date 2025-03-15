
import { useState, useEffect, useRef } from "react";
import { calculateRealTimeCost } from "@/utils/calculationUtils";
import { toast } from "sonner";

interface UseMeetingTimerProps {
  participants: number;
  annualSalary: number;
}

interface MeetingCostResult {
  totalCost: number;
  durationHours: number;
  costPerMinute: number;
  costPerPerson: number;
}

export const useMeetingTimer = ({ participants, annualSalary }: UseMeetingTimerProps) => {
  // Real-time tracking state
  const [isRunning, setIsRunning] = useState(false);
  const [meetingStartTime, setMeetingStartTime] = useState<Date | null>(null);
  const [result, setResult] = useState<MeetingCostResult>({
    totalCost: 0,
    durationHours: 0,
    costPerMinute: 0,
    costPerPerson: 0
  });
  const timerRef = useRef<number | null>(null);

  // Update timer when running
  useEffect(() => {
    if (isRunning && meetingStartTime) {
      // Update immediately
      updateRealTimeCost();
      
      // Set interval for continuous updates
      timerRef.current = window.setInterval(() => {
        updateRealTimeCost();
      }, 1000);
      
      return () => {
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isRunning, meetingStartTime, participants, annualSalary]);

  const updateRealTimeCost = () => {
    if (!meetingStartTime) return;
    
    const calculationResult = calculateRealTimeCost(
      meetingStartTime,
      participants,
      annualSalary
    );
    
    setResult(calculationResult);
  };

  const handleStartStop = () => {
    if (isRunning) {
      // Stop the meeting
      setIsRunning(false);
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      toast.success("Meeting stopped");
    } else {
      // Start the meeting
      setMeetingStartTime(new Date());
      setIsRunning(true);
      toast.success("Meeting started");
    }
  };

  return {
    isRunning,
    result,
    handleStartStop
  };
};
