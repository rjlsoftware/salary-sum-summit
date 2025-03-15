
/**
 * Calculates the cost of a meeting based on time and participants
 */
export const calculateMeetingCost = (
  startTime: Date,
  endTime: Date,
  participants: number,
  averageHourlySalary: number
): {
  totalCost: number;
  durationHours: number;
  costPerMinute: number;
  costPerPerson: number;
} => {
  // Calculate duration in milliseconds
  const durationMs = endTime.getTime() - startTime.getTime();
  
  // Convert to hours (with decimal places)
  const durationHours = durationMs / (1000 * 60 * 60);
  
  // Handle invalid inputs
  if (durationHours <= 0 || participants <= 0 || averageHourlySalary <= 0) {
    return {
      totalCost: 0,
      durationHours: 0,
      costPerMinute: 0,
      costPerPerson: 0
    };
  }
  
  // Calculate total cost
  const totalCost = durationHours * participants * averageHourlySalary;
  
  // Calculate cost per minute
  const costPerMinute = (participants * averageHourlySalary) / 60;
  
  // Calculate cost per person
  const costPerPerson = durationHours * averageHourlySalary;
  
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
