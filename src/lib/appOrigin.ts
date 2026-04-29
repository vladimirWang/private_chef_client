/** 与 Next 版一致：请求发往同源或 `VITE_APP_ORIGIN`（例：https://api.example.com） */
export function appOrigin(): string {
  return import.meta.env.VITE_APP_ORIGIN ?? "";
}

export function apiUrl(path: string): string {
  const o = appOrigin();
  if (!path.startsWith("/")) {
    return `${o}/${path}`;
  }
  return `${o}${path}`;
}
