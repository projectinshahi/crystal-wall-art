"use client";

import { useEffect, useState } from "react";
import Chip from "./Chip";

export type ChipOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type Props = {
  options: ChipOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

const ChipSelector = ({ options, value, defaultValue, onChange }: Props) => {
  
  const getInitialValue = () => {
    if (value) return value;

    if (defaultValue) return defaultValue;

    const firstAvailable = options.find((o) => !o.disabled);
    return firstAvailable?.value || "";
  };

  const [selected, setSelected] = useState<string>(getInitialValue);

  // ✅ sync when parent value changes
  useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

  // ✅ notify parent
  useEffect(() => {
    if (selected) {
      onChange?.(selected);
    }
  }, [selected]);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((item, index) => (
        <Chip
          key={index}
          label={item.label}
          selected={selected === item.value}
          disabled={item.disabled}
          onClick={() => {
            if (!item.disabled) {
              setSelected(item.value);
            }
          }}
        />
      ))}
    </div>
  );
};

export default ChipSelector;