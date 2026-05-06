/**
 * 浏览器访问 Python agent（FastAPI）的 baseURL。
 *
 * - **默认 `/py`**：仅在通过 **Vite 开发服务器**（`npm run dev`，如 :5174）打开页面时有效，
 *   由 `vite.config.ts` 把 `/py` 转发到 `127.0.0.1:8001`。
 * - **`VITE_PY_API_BASE`**：设为 `http://127.0.0.1:8001` 时**直连 agent**，适合：
 *   - 页面不是从 Vite 打开的（没有 /py 代理）；
 *   - 或希望避免相对路径 / 代理问题。
 *
 * 若页面在 8001 与 FastAPI 同源、且未走 Nginx 的 `/py`，请设置：
 * `VITE_PY_API_BASE=http://127.0.0.1:8001`（或当前 agent  origin）。
 */
export function pyApiBaseURL(): string {
  const full = (import.meta.env.VITE_PY_API_BASE as string | undefined)?.trim();
  if (full) return full.replace(/\/$/, "");
  return "/py";
}

/** 拼出对 agent 的请求 URL（相对或绝对） */
export function pyRequestUrl(apiPath: string): string {
  const p = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
  const base = pyApiBaseURL();
  if (base.startsWith("http://") || base.startsWith("https://")) {
    return `${base}${p}`;
  }
  const pre = base.replace(/\/$/, "");
  return pre ? `${pre}${p}` : p;
}
