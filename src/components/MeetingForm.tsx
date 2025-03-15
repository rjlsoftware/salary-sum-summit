
import React, { useState } from "react";
import ParticipantInput from "./ParticipantInput";
import { convertAnnualToHourly } from "@/utils/calculationUtils";
import CostDisplay from "./CostDisplay";
import { motion } from "framer-motion";
import StartStopButton from "./StartStopButton";
import { useMeetingTimer } from "@/hooks/useMeetingTimer";

const MeetingForm: React.FC = () => {
  // Default values
  const DEFAULT_PARTICIPANTS = 8;
  const DEFAULT_ANNUAL_SALARY = 85000;
  
  // Form state
  const [participants, setParticipants] = useState<number>(DEFAULT_PARTICIPANTS);
  const [annualSalary, setAnnualSalary] = useState<number>(DEFAULT_ANNUAL_SALARY);
  
  // Use custom timer hook
  const { isRunning, result, handleStartStop } = useMeetingTimer({
    participants,
    annualSalary
  });

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
          
          <StartStopButton isRunning={isRunning} onClick={handleStartStop} />
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
