import React from "react";
import clsx from "clsx";

type Variant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "body-lg"
  | "body"
  | "body-sm"
  | "caption"
  | "label"
  | "button";

type TypographyProps = {
  variant?: Variant;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

const styles: Record<Variant, string> = {
  display: "text-6xl font-heading font-bold",
  h1: "text-5xl font-heading font-bold",
  h2: "text-4xl font-heading font-semibold",
  h3: "text-3xl font-heading font-semibold",
  h4: "text-2xl font-heading font-medium",
  h5: "text-xl font-heading font-medium",

  "body-lg": "text-lg font-primary",
  body: "text-base font-primary",
  "body-sm": "text-sm font-primary",

  caption: "text-xs text-gray-500",
  label: "text-sm font-medium",
  button: "text-sm font-semibold uppercase tracking-wide",
};

export function Typography({
  variant = "body",
  as,
  className,
  children,
}: TypographyProps) {
  const Component = as || "p";

  return (
    <Component className={clsx(styles[variant], className)}>
      {children}
    </Component>
  );
}