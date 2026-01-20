import { ChartConfig } from "@/components/ui/chart";
import { Bug, BugOff } from "lucide-react";

export const VIRUS_TYPE_CONFIG = {
  threats: {
    label: "Threats",
  },
  trojan: {
    label: "Trojan",
    color: "var(--chart-1)",
  },
  ransomware: {
    label: "Ransomware",
    color: "var(--chart-2)",
  },
  spyware: {
    label: "Spyware",
    color: "var(--chart-3)",
  },
  rootkit: {
    label: "Rootkit",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export const THREAT_STATUS_CONFIG = {
  threats: {
    label: "threats",
  },
  quarantined: {
    label: "Quarantined",
    color: "var(--chart-1)",
  },
  skipped: {
    label: "Skipped",
    color: "var(--chart-2)",
  },
  deleted: {
    label: "Cleaned",
    color: "var(--chart-3)",
  },
  unresolved: {
    label: "Unresolved",
    color: "var(--destructive)",
  },
} satisfies ChartConfig

export const SCAN_TYPE_CONFIG = {
  threats: {
    label: "Threats",
  },
  main: {
    label: "Main Scan",
    color: "var(--chart-1)",
  },
  full: {
    label: "Full Scan",
    color: "var(--chart-2)",
  },
  custom: {
    label: "Custom Scan",
    color: "var(--chart-3)",
  },
  file: {
    label: "File Scan",
    color: "var(--chart-4)",
  },
  "real-time": {
    label: "Real-Time",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export const RAM_USAGE_CONFIG = {
  usage: {
    label: "Usage (%): ",
    color: "oklch(0.723 0.219 149.579)",
  },
} satisfies ChartConfig;

export const DISK_USAGE_CONFIG = {
  read: {
    label: "Read Speed",
    color: "oklch(0.81 0.117 11.638)",
  },
  write: {
    label: "Write Speed",
    color: "oklch(0.645 0.246 16.439)",
  },
} satisfies ChartConfig;

export const CPU_STATS_CONFIG = {
  util: {
    label: "Utilization (%): ",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export const ACTIVITY_STATS_CONFIG = {
  unresolved: {
    label: "Unresolved",
    color: "var(--destructive)",
    icon: Bug,
  },
  resolved: {
    label: "Resolved",
    color: "oklch(0.723 0.219 149.579)",
    icon: BugOff,
  },
} satisfies ChartConfig