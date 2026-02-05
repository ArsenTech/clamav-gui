import { SCAN_SETTINGS } from "../settings/custom-scan-options";
import { ScanProfileValues } from "../types/settings";

export function mapScanSettingsToArgs(
  settings: ScanProfileValues,
  schema = SCAN_SETTINGS
): string[] {
  const args: string[] = [];
  for (const [key, value] of Object.entries(settings)) {
    const option = schema[key as keyof typeof schema];
    if (!option) continue;
    const { flag, value: meta } = option;
    if (meta.kind === "yes-no") {
      if (value === true) args.push(flag);
      continue;
    }
    if (meta.kind === "input") {
      if (value !== undefined && value !== null && value !== "") args.push(`${flag}=${value}`);
      continue;
    }
    if (meta.kind === "choice") {
      if (value !== undefined) args.push(`${flag}=${value}`);
      continue;
    }
  }
  return args;
}

export function validateScanSettings(
  settings: ScanProfileValues,
  schema = SCAN_SETTINGS
) {
  for (const [key] of Object.entries(settings)) {
    const opt = schema[key as keyof typeof schema];
    if (!opt) continue;
    for (const dep of opt.dependsOn) {
      if (!settings[dep]) {
        delete settings[key];
      }
    }
    for (const conflict of opt.conflictsWith) {
      if (settings[conflict]) {
        delete settings[key];
      }
    }
  }
  return settings;
}