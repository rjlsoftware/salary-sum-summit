
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  name: string;
  id: string;
}

const TimeInput: React.FC<TimeInputProps> = ({
  label,
  value,
  onChange,
  className,
  name,
  id,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Handle native browser support for time inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Add a nice transition effect when focusing/blurring
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={id}
        className={cn(
          "block text-sm font-medium transition-all duration-200",
          isFocused ? "text-primary" : "text-muted-foreground"
        )}
      >
        {label}
      </Label>
      <div className={cn("relative", isFocused && "scale-in")}>
        <Input
          type="time"
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "focus-ring input-transition w-full py-3",
            isFocused && "border-primary"
          )}
          required
        />
      </div>
    </div>
  );
};

export default TimeInput;
