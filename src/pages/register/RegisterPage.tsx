import AuthShell from "@/components/auth/AuthShell";
import Verification from "./Verification";

export default function RegisterPage() {
  return (
    <AuthShell
      title="开启成长膳食之旅"
      subtitle="注册后即可与 AI 对话，获取贴合青少年发育阶段的个性化饮食建议。"
      altCta={{ preface: "已有账号？", label: "去登录", href: "/landing/login" }}
    >
      <Verification onNext={() => undefined} />
    </AuthShell>
  );
}
