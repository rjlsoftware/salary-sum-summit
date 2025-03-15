
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import TimeInput from "./TimeInput";
import ParticipantInput from "./ParticipantInput";
import { calculateMeetingCost, calculateRealTimeCost } from "@/utils/calculationUtils";
import CostDisplay from "./CostDisplay";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Play, Square, Clock } from "lucide-react";

const MeetingForm: React.FC = () => {
  // Form state
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [participants, setParticipants] = useState<number>(0);
  const [averageHourlySalary, setAverageHourlySalary] = useState<number>(0);
  
  // Calculation state
  const [result, setResult] = useState({
    totalCost: 0,
    durationHours: 0,
    costPerMinute: 0,
    costPerPerson: 0
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Real-time tracking state
  const [isRunning, setIsRunning] = useState(false);
  const [meetingStartTime, setMeetingStartTime] = useState<Date | null>(null);
  const timerRef = useRef<number | null>(null);

  // Update timer when running
  useEffect(() => {
    if (isRunning && meetingStartTime && participants > 0 && averageHourlySalary > 0) {
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
  }, [isRunning, meetingStartTime, participants, averageHourlySalary]);

  const updateRealTimeCost = () => {
    if (!meetingStartTime || participants <= 0 || averageHourlySalary <= 0) return;
    
    const calculationResult = calculateRealTimeCost(
      meetingStartTime,
      participants,
      averageHourlySalary
    );
    
    setResult(calculationResult);
    setHasCalculated(true);
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
      // Validate inputs
      if (participants <= 0 || averageHourlySalary <= 0) {
        toast.error("Please enter the number of participants and hourly salary");
        return;
      }
      
      // Start the meeting
      setMeetingStartTime(new Date());
      setIsRunning(true);
      toast.success("Meeting started");
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startTime || !endTime || participants <= 0 || averageHourlySalary <= 0) {
      toast.error("Please fill in all fields with valid values");
      return;
    }
    
    // Convert time strings to Date objects
    const today = new Date();
    const startDate = new Date(today.toDateString() + " " + startTime);
    const endDate = new Date(today.toDateString() + " " + endTime);
    
    // Handle case when end time is earlier than start time (next day meeting)
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
    
    // Animate calculation
    setIsCalculating(true);
    
    setTimeout(() => {
      const calculationResult = calculateMeetingCost(
        startDate,
        endDate,
        participants,
        averageHourlySalary
      );
      
      setResult(calculationResult);
      setHasCalculated(true);
      setIsCalculating(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-6 md:p-8 shadow-lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TimeInput
              id="start-time"
              name="startTime"
              label="Meeting Start Time"
              value={startTime}
              onChange={setStartTime}
            />
            
            <TimeInput
              id="end-time"
              name="endTime"
              label="Meeting End Time"
              value={endTime}
              onChange={setEndTime}
            />
          </div>
          
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
              label="Average Hourly Salary (USD)"
              value={averageHourlySalary}
              onChange={setAverageHourlySalary}
              placeholder="e.g., 50"
              min={1}
              icon="currency"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              type="submit"
              className="w-full py-6 text-lg font-medium rounded-xl transition-all duration-300 hover:shadow-lg"
              disabled={isCalculating || isRunning}
            >
              {isCalculating ? "Calculating..." : hasCalculated ? "Recalculate" : "Calculate Meeting Cost"}
            </Button>
            
            <Button
              type="button"
              onClick={handleStartStop}
              variant={isRunning ? "destructive" : "default"}
              className="w-full py-6 text-lg font-medium rounded-xl transition-all duration-300 hover:shadow-lg"
              disabled={isCalculating}
            >
              {isRunning ? (
                <>
                  <Square className="mr-2 h-5 w-5" />
                  Stop Real-time Tracking
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start Real-time Tracking
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.form>
      
      <CostDisplay
        totalCost={result.totalCost}
        durationHours={result.durationHours}
        costPerMinute={result.costPerMinute}
        costPerPerson={result.costPerPerson}
        participants={participants}
        isCalculating={isCalculating}
        isRunning={isRunning}
      />
    </div>
  );
};

export default MeetingForm;
