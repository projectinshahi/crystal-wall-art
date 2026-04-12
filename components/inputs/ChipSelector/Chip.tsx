"use client";

import clsx from "clsx";

type ChipProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
};

const Chip = ({
  label,
  selected = false,
  disabled = false,
  onClick,
  type = "button",
}: ChipProps) => {
  const handleClick = () => {
    if (!disabled) {
      onClick?.();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={clsx(
        "px-3 py-1 rounded-full text-sm transition-all duration-200",
        "flex items-center justify-center",
        "focus:outline-none focus:ring-2 focus:ring-black/20",

        // default
        !selected && !disabled && "bg-lightBackground text-black hover:bg-black/10",

        // selected
        selected && !disabled && "bg-black/60 text-white",

        // disabled
        disabled && "bg-lightBackground text-customBeige opacity-50 cursor-not-allowed"
      )}
    >
      {label}
    </button>
  );
};

export default Chip;