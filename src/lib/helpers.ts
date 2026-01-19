export function formatBytes(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
}

export function pickKeys<T extends object, K extends readonly (keyof T)[]>(
  obj: T,
  keys: K
): Pick<T, K[number]> {
  const out = {} as Pick<T, K[number]>
  for (const key of keys)
    if (key in obj)
      out[key] = obj[key];
  return out;
}

export function formatDuration(seconds: number){
  const hh = Math.floor(seconds/3600).toString().padStart(2,"0");
  const mm = Math.floor((seconds%3600)/60).toString().padStart(2,"0");
  const ss = (seconds%60).toString().padStart(2,"0");
  return `${hh}:${mm}:${ss}`;
}

export function normalizePaths(
  value: string | string[] | null
): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function parseClamVersion(raw: string) {
  const match = raw.match(/ClamAV\s(.+?)\/(\d+)\/(.+)/);
  if (!match) return null;

  const dbDate = new Date(match[3]);

  const ageDays =
    (Date.now() - dbDate.getTime()) / (1000 * 60 * 60 * 24);

  return {
    engine: match[1],
    dbVersion: match[2],
    dbDate,
    isOutdated: ageDays > 3,
  };
}