"use client";

import React, { useState } from "react";
import clsx from "clsx";

type RatingProps = {
  value?: number;
  max?: number;
  size?: number;
  onChange?: (value: number) => void;
};

const Rating = ({
  value = 0,
  max = 5,
  size = 20,
  onChange,
}: RatingProps) => {
  const [hover, setHover] = useState<number | null>(null);

  const getFill = (index: number) => {
    const current = hover ?? value;

    if (current >= index + 1) return "full";
    if (current >= index + 0.5) return "half";
    return "empty";
  };

  const handleClick = (
    e: React.MouseEvent<SVGSVGElement>,
    index: number
  ) => {
    if (!onChange) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const isLeft = e.clientX - rect.left < rect.width / 2;

    const newValue = isLeft ? index + 0.5 : index + 1;
    onChange(newValue);
  };

  const handleHover = (
    e: React.MouseEvent<SVGSVGElement>,
    index: number
  ) => {
    if (!onChange) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const isLeft = e.clientX - rect.left < rect.width / 2;

    setHover(isLeft ? index + 0.5 : index + 1);
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => {
        const fillType = getFill(i);

        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            onClick={(e) => handleClick(e, i)}
            onMouseMove={(e) => handleHover(e, i)}
            onMouseLeave={() => setHover(null)}
            className={clsx(
              "transition-all duration-200 text-rating",
              onChange ? "cursor-pointer hover:scale-110" : ""
            )}
            style={{ width: size, height: size }}
          >
            {/* Empty star */}
            <path
              d="M12 17.27L18.18 21 16.54 13.97 
                 22 9.24 14.81 8.63 
                 12 2 9.19 8.63 
                 2 9.24 7.46 13.97 
                 5.82 21z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            {/* Full fill */}
            {fillType === "full" && (
              <path
                d="M12 17.27L18.18 21 16.54 13.97 
                   22 9.24 14.81 8.63 
                   12 2 9.19 8.63 
                   2 9.24 7.46 13.97 
                   5.82 21z"
                fill="currentColor"
              />
            )}

            {/* Half fill */}
            {fillType === "half" && (
              <defs>
                <linearGradient id={`half-${i}`}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}

            {fillType === "half" && (
              <path
                d="M12 17.27L18.18 21 16.54 13.97 
                   22 9.24 14.81 8.63 
                   12 2 9.19 8.63 
                   2 9.24 7.46 13.97 
                   5.82 21z"
                fill={`url(#half-${i})`}
              />
            )}
          </svg>
        );
      })}
    </div>
  );
};

export default Rating;