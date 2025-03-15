
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Users, DollarSign } from "lucide-react";

interface ParticipantInputProps {
  id: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
  label: string;
  placeholder: string;
  min?: number;
  icon: "users" | "currency";
  className?: string;
}

const ParticipantInput: React.FC<ParticipantInputProps> = ({
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  min = 0,
  icon,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to number and validate
    const newValue = e.target.value === "" ? 0 : Number(e.target.value);
    if (!isNaN(newValue) && newValue >= min) {
      onChange(newValue);
    }
  };

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
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon === "users" ? (
            <Users className="h-4 w-4" />
          ) : (
            <DollarSign className="h-4 w-4" />
          )}
        </div>
        <Input
          type="number"
          id={id}
          name={name}
          value={value === 0 ? "" : value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          min={min}
          className={cn(
            "focus-ring input-transition w-full pl-10 py-3",
            isFocused && "border-primary"
          )}
          required
        />
      </div>
    </div>
  );
};

export default ParticipantInput;
