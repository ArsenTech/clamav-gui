import { ChartConfig } from "@/components/ui/chart";
import { TFunction } from "i18next";
import { Bug, BugOff } from "lucide-react";

export const GET_VIRUS_TYPE_CONFIG = (t: TFunction<"stats">) => ({
  threats: {
    label: t("stat-label"),
  },
  trojan: {
    label: t("virus-types.trojan"),
    color: "var(--chart-1)",
  },
  ransomware: {
    label: t("virus-types.ransomware"),
    color: "var(--chart-2)",
  },
  spyware: {
    label: t("virus-types.spyware"),
    color: "var(--chart-3)",
  },
  rootkit: {
    label: t("virus-types.rootkit"),
    color: "var(--chart-4)",
  },
  other: {
    label: t("virus-types.other"),
    color: "var(--chart-5)",
  },
}) satisfies ChartConfig

export const GET_THREAT_STATUS_CONFIG = (t: TFunction<"stats">) => ({
  threats: {
    label: t("stat-label"),
  },
  quarantined: {
    label: t("threats.quarantined"),
    color: "var(--chart-1)",
  },
  skipped: {
    label: t("threats.skipped"),
    color: "var(--chart-2)",
  },
  deleted: {
    label: t("threats.deleted"),
    color: "var(--chart-3)",
  },
  unresolved: {
    label: t("threats.unresolved"),
    color: "var(--destructive)",
  },
}) satisfies ChartConfig

export const GET_SCAN_TYPE_CONFIG = (t: TFunction<"stats">) => ({
  threats: {
    label: t("stat-label"),
  },
  main: {
    label: t("scan.main"),
    color: "var(--chart-1)",
  },
  full: {
    label: t("scan.full"),
    color: "var(--chart-2)",
  },
  custom: {
    label: t("scan.custom"),
    color: "var(--chart-3)",
  },
  file: {
    label: t("scan.file"),
    color: "var(--chart-4)",
  },
  realtime: {
    label: t("scan.real-time"),
    color: "var(--chart-5)",
  },
}) satisfies ChartConfig

export const GET_RAM_USAGE_CONFIG = (t: TFunction<"stats">) => ({
  usage: {
    label: t("ram.usage"),
    color: "oklch(0.723 0.219 149.579)",
  },
}) satisfies ChartConfig;

export const GET_DISK_USAGE_CONFIG = (t: TFunction<"stats">) => ({
  read: {
    label: t("disk.labels.read"),
    color: "oklch(0.81 0.117 11.638)",
  },
  write: {
    label: t("disk.labels.write"),
    color: "oklch(0.645 0.246 16.439)",
  },
}) satisfies ChartConfig;

export const GET_CPU_STATS_CONFIG = (t: TFunction<"stats">) => ({
  util: {
    label: t("cpu.utilization"),
    color: "oklch(0.623 0.214 259.815)",
  },
}) satisfies ChartConfig;

export const GET_ACTIVITY_STATS_CONFIG = (t: TFunction<"stats">) => ({
  unresolved: {
    label: t("activity.unresolved"),
    color: "var(--destructive)",
    icon: Bug,
  },
  resolved: {
    label: t("activity.resolved"),
    color: "oklch(0.723 0.219 149.579)",
    icon: BugOff,
  },
}) satisfies ChartConfig