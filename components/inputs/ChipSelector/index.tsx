import { useEffect, useState } from "react";
import Chip from "./Chip";

export type ChipOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type Props = {
  options: ChipOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
};

const ChipSelector = ({ options, defaultValue, onChange }: Props) => {
  const getInitialValue = () => {
    // ✅ if default exists → use it
    if (defaultValue) return defaultValue;

    // ✅ else → pick first non-disabled option
    const firstAvailable = options.find((o) => !o.disabled);
    return firstAvailable?.value || "";
  };

  const [selected, setSelected] = useState<string>(getInitialValue);

  // 🔥 keep parent synced
  useEffect(() => {
    if (selected) {
      onChange?.(selected);
    }
  }, [selected]);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((item, index: number) => (
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