"use client";

import { useEffect, useId, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Switch } from "@/components/ui/switch";

export default function ModeToggle() {
  const id = useId();
  const { setTheme, resolvedTheme } = useTheme();
  const [checked, setChecked] = useState(false);

  // Sync switch with current theme
  useEffect(() => {
    if (resolvedTheme === "dark") {
      setChecked(false);
    } else if (resolvedTheme === "light") {
      setChecked(true);
    }
  }, [resolvedTheme]);

  const toggleSwitch = (value: boolean) => {
    setChecked(value);
    setTheme(value ? "light" : "dark");
  };

  return (
    <div
      className="group inline-flex items-center gap-2"
      data-state={checked ? "checked" : "unchecked"}
    >
      <span
        id={`${id}-off`}
        className="group-data-[state=checked]:text-muted-foreground/70 flex-1 cursor-pointer text-right text-sm font-medium"
        aria-controls={id}
        onClick={() => toggleSwitch(false)}
      >
        <MoonIcon size={16} aria-hidden="true" />
      </span>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={toggleSwitch}
        aria-labelledby={`${id}-off ${id}-on`}
        aria-label="Toggle between dark and light mode"
      />
      <span
        id={`${id}-on`}
        className="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left text-sm font-medium"
        aria-controls={id}
        onClick={() => toggleSwitch(true)}
      >
        <SunIcon size={16} aria-hidden="true" />
      </span>
    </div>
  );
}
