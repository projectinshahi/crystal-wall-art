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
        "relative flex items-center justify-center",
        "focus:outline-none focus:ring-2 focus:ring-black/20",

        // default
        !selected && !disabled && "bg-lightBackground text-black hover:bg-black/10",

        // selected
        selected && !disabled && "bg-black/60 text-white",

        // disabled
        disabled && "bg-lightBackground text-black/40 cursor-not-allowed"
      )}
    >
      {label}
      {disabled && (
        // Red cross marks an option that isn't available for the current selection
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-3 inset-y-1 h-[calc(100%-0.5rem)] w-[calc(100%-1.5rem)] text-red-500/80"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          {/* Stretched across the whole chip; non-scaling stroke keeps the lines evenly thin */}
          <path d="M0 0L100 100M100 0L0 100" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </button>
  );
};

export default Chip;