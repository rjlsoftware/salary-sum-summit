
/**
 * Converts annual salary to hourly rate
 * Assumes 52 work weeks and 40 hours per week
 */
export const convertAnnualToHourly = (annualSalary: number): number => {
  return annualSalary / (52 * 40);
};

/**
 * Calculates the real-time cost based on elapsed time
 */
export const calculateRealTimeCost = (
  startTime: Date,
  participants: number,
  annualSalary: number
): {
  totalCost: number;
  durationHours: number;
  costPerMinute: number;
  costPerPerson: number;
} => {
  const now = new Date();
  
  // Convert annual salary to hourly
  const hourlyRate = convertAnnualToHourly(annualSalary);
  
  // Calculate duration in milliseconds
  const durationMs = now.getTime() - startTime.getTime();
  
  // Convert to hours (with decimal places)
  const durationHours = durationMs / (1000 * 60 * 60);
  
  // Handle invalid inputs
  if (durationHours <= 0 || participants <= 0 || hourlyRate <= 0) {
    return {
      totalCost: 0,
      durationHours: 0,
      costPerMinute: 0,
      costPerPerson: 0
    };
  }
  
  // Calculate total cost
  const totalCost = durationHours * participants * hourlyRate;
  
  // Calculate cost per minute
  const costPerMinute = (participants * hourlyRate) / 60;
  
  // Calculate cost per person
  const costPerPerson = durationHours * hourlyRate;
  
  return {
    totalCost,
    durationHours,
    costPerMinute,
    costPerPerson
  };
};

/**
 * Formats a number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formats a duration in hours to a human-readable string
 */
export const formatDuration = (hours: number): string => {
  const totalMinutes = Math.round(hours * 60);
  
  if (totalMinutes < 1) {
    return "Less than a minute";
  }
  
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  
  const hourText = h > 0 ? `${h} hour${h !== 1 ? 's' : ''}` : '';
  const minuteText = m > 0 ? `${m} minute${m !== 1 ? 's' : ''}` : '';
  
  if (hourText && minuteText) {
    return `${hourText} and ${minuteText}`;
  }
  
  return hourText || minuteText;
};
