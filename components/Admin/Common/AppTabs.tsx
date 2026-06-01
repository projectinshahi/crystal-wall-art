"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Typography } from "@/components/ui/Typography";
import React from "react";

export type TabItem = {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  header?: React.ReactNode;
};

interface AppTabsProps {
  tabs: TabItem[];

  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;

  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;

  fullWidth?: boolean;
}

export default function AppTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className = "",
  listClassName = "",
  triggerClassName = "",
  contentClassName = "",
  fullWidth = false
}: AppTabsProps) {
  return (
    <Tabs
      defaultValue={defaultValue || tabs[0]?.value}
      value={value}
      onValueChange={onValueChange}
      className={className}
    >
      {/* Tabs Header */}
      <TabsList
        className={`w-full ${fullWidth ? "grid grid-cols-" + tabs.length : ""
          } ${listClassName}`}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            type="button"
            value={tab.value}
            disabled={tab.disabled}
            className={triggerClassName}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <Card className="bg-card p-6 mt-4">
        {tabs.map((tab) => (
          <>
            {/* Tabs Content */}
            <TabsContent
              key={tab.value}
              value={tab.value}
              className={`space-y-3 ${contentClassName}`}
              >
              {tab.header}
              {tab.content}
            </TabsContent>
          </>
        ))}
      </Card>
    </Tabs>
  );
}