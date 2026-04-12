"use client";

import React from "react";
import clsx from "clsx";

type ColorOption = {
  label?: string;
  value: string; // hex or css color
};

type ColorSelectorProps = {
  colors: ColorOption[];
  value?: string;
  onChange?: (color: string) => void;
  className?: string;
};

const ColorSelector = ({
  colors,
  value,
  onChange,
  className,
}: ColorSelectorProps) => {
  return (
    <div className={clsx("flex items-center gap-3", className)}>
      {colors.map((color) => {
        const isSelected = value === color.value;

        return (
          <button
            key={color.value}
            onClick={() => onChange?.(color.value)}
            className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center transition",
              "border",
              isSelected ? "border-black" : "border-transparent"
            )}
          >
            <span
              className="w-6 h-6 rounded-full border border-grayBorder"
              style={{ backgroundColor: color.value }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default ColorSelector;