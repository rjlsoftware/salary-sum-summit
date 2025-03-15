
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import ParticipantInput from "./ParticipantInput";
import { calculateRealTimeCost, convertAnnualToHourly } from "@/utils/calculationUtils";
import CostDisplay from "./CostDisplay";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Play, Square } from "lucide-react";

const MeetingForm: React.FC = () => {
  // Default values
  const DEFAULT_PARTICIPANTS = 8;
  const DEFAULT_ANNUAL_SALARY = 85000;
  
  // Form state
  const [participants, setParticipants] = useState<number>(DEFAULT_PARTICIPANTS);
  const [annualSalary, setAnnualSalary] = useState<number>(DEFAULT_ANNUAL_SALARY);
  
  // Calculation state
  const [result, setResult] = useState({
    totalCost: 0,
    durationHours: 0,
    costPerMinute: 0,
    costPerPerson: 0
  });

  // Real-time tracking state
  const [isRunning, setIsRunning] = useState(false);
  const [meetingStartTime, setMeetingStartTime] = useState<Date | null>(null);
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card rounded-2xl p-6 md:p-8 shadow-lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ParticipantInput
              id="participants"
              name="participants"
              label="Number of Participants"
              value={participants}
              onChange={setParticipants}
              placeholder="e.g., 8"
              min={1}
              icon="users"
            />
            
            <ParticipantInput
              id="salary"
              name="salary"
              label="Annual Salary (USD)"
              value={annualSalary}
              onChange={setAnnualSalary}
              placeholder="e.g., 85000"
              min={1}
              icon="currency"
            />
          </div>
          
          <Button
            type="button"
            onClick={handleStartStop}
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
        </div>
      </motion.div>
      
      <CostDisplay
        totalCost={result.totalCost}
        durationHours={result.durationHours}
        costPerMinute={result.costPerMinute}
        costPerPerson={result.costPerPerson}
        participants={participants}
        hourlyRate={convertAnnualToHourly(annualSalary)}
        isCalculating={false}
        isRunning={isRunning}
      />
    </div>
  );
};

export default MeetingForm;
