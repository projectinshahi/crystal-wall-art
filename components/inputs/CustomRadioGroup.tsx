"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";
import { Typography } from "../ui/Typography";

type Option = {
  label: string;
  value: string;
};

type CustomRadioGroupProps = {
  options: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
};

const CustomRadioGroup = ({
  options,
  defaultValue,
  onChange,
}: CustomRadioGroupProps) => {
  return (
    <>
      {/* Radio Group */}
      <RadioGroup
        defaultValue={defaultValue}
        onValueChange={onChange}
        className="w-fit mt-2"
        >
        {options.map((option, index) => {
            const id = `radio-${option.value}-${index}`;
            
            return (
                <label
                key={option.value}
                htmlFor={id}
                className="flex items-center gap-3 cursor-pointer"
                >
              <RadioGroupItem value={option.value} id={id} />
              <Typography variant="label">{option.label}</Typography>
            </label>
          );
        })}
      </RadioGroup>
        </>
  );
};

export default CustomRadioGroup;