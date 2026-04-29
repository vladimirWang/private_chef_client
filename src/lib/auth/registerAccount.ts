import { apiUrl } from "@/lib/appOrigin";

export type RegisterPayload = {
  email: string;
  password: string;
  nickname?: string;
};

export type RegisterResult =
  | { ok: true; id: number; email: string; nickname: string | null }
  | { ok: false; error: string; status?: number };

export async function registerAccount(payload: RegisterPayload): Promise<RegisterResult> {
  const res = await fetch(apiUrl("/api/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      nickname: payload.nickname,
    }),
    credentials: "include",
  });
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return { ok: false, error: "服务器响应异常", status: res.status };
  }
  const err =
    typeof data === "object" && data !== null && "error" in data
      ? String((data as { error: unknown }).error)
      : "注册失败";

  if (!res.ok) {
    return { ok: false, error: err, status: res.status };
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "email" in data
  ) {
    const o = data as { id: number; email: string; nickname?: string | null };
    return {
      ok: true,
      id: o.id,
      email: o.email,
      nickname: o.nickname ?? null,
    };
  }

  return { ok: false, error: "响应格式异常", status: res.status };
}
