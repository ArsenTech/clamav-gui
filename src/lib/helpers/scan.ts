import { SCAN_SETTINGS } from "../settings/custom-scan-options";

type ScanValue =
  | boolean
  | number
  | string;
export function mapScanSettingsToArgs(
  settings: Record<string, ScanValue>,
  schema = SCAN_SETTINGS
): string[] {
  const args: string[] = [];
  for (const [key, value] of Object.entries(settings)) {
    const option = schema[key as keyof typeof schema];
    if (!option) continue;
    const { flag, value: meta } = option;
    // YES / NO
    if (meta.kind === "yes-no") {
      if (value === true) args.push(flag);
      continue;
    }
    // INPUT (number, path, string)
    if (meta.kind === "input") {
      if (value !== undefined && value !== null && value !== "") args.push(`${flag}=${value}`);
      continue;
    }
    // CHOICE
    if (meta.kind === "choice") {
      if (value !== undefined) args.push(`${flag}=${value}`);
      continue;
    }
  }
  return args;
}

export function validateScanSettings(
  settings: Record<string, ScanValue>,
  schema = SCAN_SETTINGS
) {
  for (const [key] of Object.entries(settings)) {
    const opt = schema[key as keyof typeof schema];
    if (!opt) continue;

    // DEPENDS ON
    for (const dep of opt.dependsOn) {
      if (!settings[dep]) {
        delete settings[key];
      }
    }

    // CONFLICTS WITH
    for (const conflict of opt.conflictsWith) {
      if (settings[conflict]) {
        delete settings[key];
      }
    }
  }

  return settings;
}