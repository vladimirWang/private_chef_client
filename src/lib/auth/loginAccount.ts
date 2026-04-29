import { apiUrl } from "@/lib/appOrigin";

export type LoginPayload = {
  email: string;
  password: string;
  remember?: boolean;
};

export type LoginUser = {
  id: number;
  email: string;
  nickname: string | null;
};

export type LoginResult =
  | { ok: true; user: LoginUser }
  | { ok: false; error: string; status?: number };

export async function loginAccount(payload: LoginPayload): Promise<LoginResult> {
  const res = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      remember: payload.remember === true,
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
      : "登录失败";

  if (!res.ok) {
    return { ok: false, error: err, status: res.status };
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "user" in data &&
    typeof (data as { user: unknown }).user === "object" &&
    (data as { user: LoginUser }).user !== null
  ) {
    const u = (data as { user: LoginUser }).user;
    if (typeof u.id === "number" && typeof u.email === "string") {
      return { ok: true, user: u };
    }
  }

  return { ok: false, error: "响应格式异常", status: res.status };
}
