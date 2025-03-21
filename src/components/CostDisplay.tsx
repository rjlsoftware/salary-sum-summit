
import React, { useState, useEffect, useRef } from "react";
import { formatCurrency, formatDuration } from "@/utils/calculationUtils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface CostDisplayProps {
  totalCost: number;
  durationHours: number;
  costPerMinute: number;
  costPerPerson: number;
  participants: number;
  hourlyRate: number;
  isCalculating: boolean;
  isRunning?: boolean;
}

const CostDisplay: React.FC<CostDisplayProps> = ({
  totalCost,
  durationHours,
  costPerMinute,
  costPerPerson,
  participants,
  hourlyRate,
  isCalculating,
  isRunning = false,
}) => {
  const [displayedCost, setDisplayedCost] = useState(0);
  const previousTotalCost = useRef(totalCost);
  
  // Animated counter effect for the cost
  useEffect(() => {
    if (isCalculating || totalCost !== previousTotalCost.current) {
      let startValue = previousTotalCost.current;
      const endValue = totalCost;
      const duration = 1000; // ms
      const frameRate = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameRate);
      const valueIncrement = (endValue - startValue) / totalFrames;
      
      let currentFrame = 0;
      
      const counter = setInterval(() => {
        currentFrame++;
        const newValue = startValue + valueIncrement * currentFrame;
        
        setDisplayedCost(newValue);
        
        if (currentFrame >= totalFrames) {
          clearInterval(counter);
          setDisplayedCost(endValue);
        }
      }, frameRate);
      
      previousTotalCost.current = totalCost;
      
      return () => clearInterval(counter);
    }
  }, [totalCost, isCalculating]);

  // No need to display anything if no calculation has been made yet
  if (totalCost === 0 && !isCalculating && !isRunning) {
    return null;
  }

  const annualTeamCost = hourlyRate * participants * 52 * 40;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-8 w-full"
    >
      <div className="glass-card rounded-2xl p-6 md:p-8 shadow-lg">
        <h2 className="text-2xl font-medium text-center mb-6 flex items-center justify-center">
          {isRunning ? (
            <>
              <Clock className="w-6 h-6 mr-2 text-red-500 animate-pulse" />
              <span>Real-time Meeting Cost</span>
            </>
          ) : (
            "Meeting Cost"
          )}
        </h2>
        
        <div className="flex flex-col items-center justify-center mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            {isRunning ? "Current Cost:" : "Total Cost:"}
          </p>
          <div className={cn(
            "text-4xl md:text-5xl font-bold tracking-tight animate-counter",
            isRunning ? "text-red-500" : "text-primary"
          )}>
            {formatCurrency(displayedCost)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="flex flex-col items-center p-4 rounded-xl bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Duration</p>
            <p className="text-xl font-medium">{formatDuration(durationHours)}</p>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-xl bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Cost Per Minute</p>
            <p className="text-xl font-medium">{formatCurrency(costPerMinute)}/min</p>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-xl bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Cost Per Person</p>
            <p className="text-xl font-medium">{formatCurrency(costPerPerson)}</p>
          </div>
        </div>
        
        {participants > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground">
              This meeting with {participants} participant{participants !== 1 ? 's' : ''} costs your organization{' '}
              <span className="font-semibold text-foreground">
                {formatCurrency(costPerMinute)} per minute
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Annual team cost: <span className="font-semibold text-foreground">{formatCurrency(annualTeamCost)}</span> 
              <span className="text-xs ml-1">
                (based on {participants} people at {formatCurrency(hourlyRate)}/hr)
              </span>
            </p>
            {isRunning && (
              <p className="text-sm text-red-500 mt-2 font-medium animate-pulse">
                Timer is running — costs are updating in real-time
              </p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CostDisplay;
