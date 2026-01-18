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